import { Request, Response } from 'express';
import {
  UpdateSheepSchema,
  updateSheepSchema,
} from '../../validation/sheep.schemas';

import { Sheep } from '../../model/sheep.model';
import { Types } from 'mongoose';
import { ZodError } from 'zod';
import sheepService from '../../service/sheep.service';

export async function updateSheep(req: Request, res: Response) {
  const { sheepId } = req.params;
  if (!Types.ObjectId.isValid(sheepId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  let sheepData: UpdateSheepSchema;
  let updatedSheep: Sheep | null;

  // validate payload
  try {
    sheepData = await updateSheepSchema.parseAsync(req.body);
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
    updatedSheep = await sheepService.updateSheep(sheepId, sheepData);

    if (!updatedSheep) {
      res
        .status(404)
        .json({ message: `Sheep with id ${sheepId} does not exist` });
      return;
    }

    res.status(200).json(updatedSheep);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
