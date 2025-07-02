import { Request, Response } from 'express';
import {
  UpdateBreedSchema,
  updateBreedSchema,
} from '../../validation/sheep.schemas';

import { SheepBreed } from '../../model/sheep.model';
import { Types } from 'mongoose';
import { ZodError } from 'zod';
import sheepService from '../../service/sheep.service';

export async function updateBreed(req: Request, res: Response) {
  const { breedId } = req.params;
  if (!Types.ObjectId.isValid(breedId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  let breedData: UpdateBreedSchema;
  let updatedBreed: SheepBreed | null;

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
    updatedBreed = await sheepService.updateBreed(breedId, breedData);

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
