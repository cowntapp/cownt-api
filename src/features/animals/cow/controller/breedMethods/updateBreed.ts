import { Request, Response } from 'express';
import {
  UpdateBreedSchema,
  updateBreedSchema,
} from '../../validation/cow.schemas';

import { CowBreed } from '../../model/cow.model';
import { Types } from 'mongoose';
import { ZodError } from 'zod';
import cowService from '../../service/cow.service';

export async function updateBreed(req: Request, res: Response) {
  const { breedId } = req.params;
  if (!Types.ObjectId.isValid(breedId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  let breedData: UpdateBreedSchema;
  let updatedBreed: CowBreed | null;

  try {
    breedData = await updateBreedSchema.parseAsync(req.body);
    if (Object.entries(breedData).length === 0) {
      res.status(400).json({ message: 'No valid data found' });
      return;
    }
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
    updatedBreed = await cowService.updateBreed(breedId, breedData);

    if (!updatedBreed) {
      res.status(404).json({ message: 'Breed not found' });
      return;
    }

    res.status(200).json(updatedBreed);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
