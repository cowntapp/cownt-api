import {
  CreateBreedSchema,
  createBreedSchema,
} from '../../validation/cow.schemas';
import { Request, Response } from 'express';

import { CowBreed } from '../../model/cow.model';
import { ZodError } from 'zod';
import cowService from '../../service/cow.service';

export async function createBreed(req: Request, res: Response) {
  let breedData: CreateBreedSchema;
  let newBreed: CowBreed;

  try {
    breedData = await createBreedSchema.parseAsync(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error.issues);
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
    return;
  }

  try {
    newBreed = await cowService.createBreed(breedData);
    res.status(200).json(newBreed);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
