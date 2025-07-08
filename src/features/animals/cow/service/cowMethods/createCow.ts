import CowModel, { Cow } from '../../model/cow.model';
import {
  checkBreedExistsById,
  checkCharacteristicExistsById,
  checkCowExistsByLongCode,
} from '../utils/validations';

import { CreateCowSchema } from '../../validation/cow.schemas';
import mongoose from 'mongoose';
import { COW_SHORT_CODE_LAST_CHARS_NUM } from '../../consts';
import { ORIGIN } from '../../../animalsConsts';
import appAssert from '../../../../../lib/utils/appAssert';
import AppError from '../../../../../lib/utils/AppError';
import {
  CONFLICT,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../../../../../lib/constants/http';
import AppErrorCode from '../../../../../lib/constants/appErrorCode';

export async function createCow(cowData: CreateCowSchema) {
  const { longCode, breed, characteristics } = cowData;

  // Check if cow already exists
  const cowExists = await checkCowExistsByLongCode(longCode);
  appAssert(
    !cowExists,
    CONFLICT,
    'Cow already exists',
    AppErrorCode.CowAlreadyExists
  );

  // Check if breed exists
  const breedExists = await checkBreedExistsById(breed);
  appAssert(
    breedExists,
    NOT_FOUND,
    'Breed does not exist',
    AppErrorCode.BreedNotFound
  );

  // Check if all characteristics exist
  if (characteristics) {
    const allCharacteristicsExists = (
      await Promise.all(
        characteristics.map((char) => checkCharacteristicExistsById(char))
      )
    ).every((res) => res === true);

    appAssert(
      allCharacteristicsExists,
      NOT_FOUND,
      'One or more characteristics do not exist',
      AppErrorCode.CharacteristicNotFound
    );
  }

  const shortCode = longCode.slice(-COW_SHORT_CODE_LAST_CHARS_NUM);
  const newCow = { ...cowData, shortCode };
  let createdCow: Cow;

  /**
   * Animal could be bought or born
   * - if animal is born, mother must be passed
   * - if animal is bought mother must not be passed
   *
   * if mother is passed, the child (current animal) must be added to it's children arrays
   */
  if (!newCow.mother && newCow.origin === ORIGIN.BOUGHT) {
    // if none is passed the animal we only create the animal document
    createdCow = await CowModel.create(newCow);
  } else if (newCow.mother && newCow.origin === ORIGIN.BORN) {
    // both are passed so must update father and mother documents
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      createdCow = new CowModel(newCow);

      // updating mother births
      await CowModel.updateMany(
        { _id: newCow.mother },
        { $push: { children: createdCow.id } }
      ).session(session);

      await createdCow.save({ session });

      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  } else {
    throw new AppError(
      INTERNAL_SERVER_ERROR,
      'Invalid cow origin for mother relationship',
      AppErrorCode.InvalidOrigin
    );
  }

  return createdCow;
}
