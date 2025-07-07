import { CookieOptions, Response } from 'express';

import {
  ACCESS_TOKEN_DURATION_MINUTES,
  REFRESH_TOKEN_DURATION_DAYS,
} from '../../config/appGlobalConfig.js';
import { daysFromNow, minutesFromNow } from './date.js';
import { NODE_ENV } from '../constants/env.js';

export const REFRESH_PATH = '/auth/refresh';
const enum TOKEN_KEYS {
  ACCESS_TOKEN_KEY = 'accessToken',
  REFRESH_TOKEN_KEY = 'refreshToken',
}

const secure = NODE_ENV !== 'development';
const sameSite = NODE_ENV !== 'development' ? 'none' : 'lax';

const defaults: CookieOptions = {
  httpOnly: true,
  sameSite,
  secure,
};

export const getAccesssTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: minutesFromNow(ACCESS_TOKEN_DURATION_MINUTES),
});
export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: daysFromNow(REFRESH_TOKEN_DURATION_DAYS),
  path: REFRESH_PATH,
});

interface Params {
  [TOKEN_KEYS.ACCESS_TOKEN_KEY]: string;
  [TOKEN_KEYS.REFRESH_TOKEN_KEY]: string;
  res: Response;
}

export const setAuthCookies = ({ accessToken, refreshToken, res }: Params) => {
  return res
    .cookie(
      TOKEN_KEYS.ACCESS_TOKEN_KEY,
      accessToken,
      getAccesssTokenCookieOptions()
    )
    .cookie(
      TOKEN_KEYS.REFRESH_TOKEN_KEY,
      refreshToken,
      getRefreshTokenCookieOptions()
    );
};

export const clearAuthCookies = (res: Response) => {
  // Debe coincidir con los mismos atributos usados al setear las cookies
  return res
    .clearCookie(TOKEN_KEYS.ACCESS_TOKEN_KEY, {
      httpOnly: true,
      sameSite,
      secure,
    })
    .clearCookie(TOKEN_KEYS.REFRESH_TOKEN_KEY, {
      httpOnly: true,
      sameSite,
      secure,
      path: REFRESH_PATH,
    });
};

export const setRefreshCookie = ({
  refreshToken,
  res,
}: Omit<Params, TOKEN_KEYS.ACCESS_TOKEN_KEY>) => {
  return res.cookie(
    TOKEN_KEYS.REFRESH_TOKEN_KEY,
    refreshToken,
    getRefreshTokenCookieOptions()
  );
};

export const setAccessCookie = ({
  accessToken,
  res,
}: Omit<Params, TOKEN_KEYS.REFRESH_TOKEN_KEY>) => {
  const result = res.cookie(
    TOKEN_KEYS.ACCESS_TOKEN_KEY,
    accessToken,
    getAccesssTokenCookieOptions()
  );

  console.log('Response headers:', res.getHeaders());

  return result;
};
