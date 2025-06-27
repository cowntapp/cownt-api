import { CreateCowSchema, createCowSchema } from '../../validation/cow.schemas';
import { Request, Response } from 'express';

import { Cow } from '../../model/cow.model';
import { ZodError } from 'zod';
import cowService from '../../service/cow.service';

export async function createCow(req: Request, res: Response) {
  let cowData: CreateCowSchema;
  let newCow: Cow;

  // validate payload
  try {
    cowData = await createCowSchema.parseAsync(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(error.issues);
      res.status(400).json(error.issues);
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
    return;
  }

  try {
    newCow = await cowService.createCow(cowData);
    res.status(201).json(newCow);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
