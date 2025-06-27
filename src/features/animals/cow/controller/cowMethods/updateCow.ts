import { Request, Response } from 'express';
import { UpdateCowSchema, updateCowSchema } from '../../validation/cow.schemas';

import { Cow } from '../../model/cow.model';
import { Types } from 'mongoose';
import { ZodError } from 'zod';
import cowService from '../../service/cow.service';

export async function updateCow(req: Request, res: Response) {
  const { cowId } = req.params;
  if (!Types.ObjectId.isValid(cowId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  let cowData: UpdateCowSchema;
  let updatedCow: Cow | null;

  // validate payload
  try {
    cowData = await updateCowSchema.parseAsync(req.body);
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
    updatedCow = await cowService.updateCow(cowId, cowData);

    if (!updatedCow) {
      res.status(404).json({ message: `Cow with id ${cowId} does not exist` });
      return;
    }

    res.status(200).json(updatedCow);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
