import {
  CreateBreedSchema,
  createBreedSchema,
} from '../../validation/sheep.schemas';
import { Request, Response } from 'express';

import { SheepBreed } from '../../model/sheep.model';
import { ZodError } from 'zod';
import sheepService from '../../service/sheep.service';

export async function createBreed(req: Request, res: Response) {
  let breedData: CreateBreedSchema;
  let newBreed: SheepBreed;

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
    newBreed = await sheepService.createBreed(breedData);
    res.status(200).json(newBreed);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
