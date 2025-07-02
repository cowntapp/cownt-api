import {
  CreateSheepSchema,
  createSheepSchema,
} from '../../validation/sheep.schemas';
import { Request, Response } from 'express';

import { Sheep } from '../../model/sheep.model';
import { ZodError } from 'zod';
import sheepService from '../../service/sheep.service';

export async function createSheep(req: Request, res: Response) {
  let sheepData: CreateSheepSchema;
  let newSheep: Sheep;

  // validate payload
  try {
    sheepData = await createSheepSchema.parseAsync(req.body);
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
    newSheep = await sheepService.createSheep(sheepData);
    res.status(201).json(newSheep);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
