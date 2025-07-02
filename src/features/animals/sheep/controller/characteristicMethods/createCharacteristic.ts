import {
  CreateCharacteristicSchema,
  createCharacteristicSchema,
} from '../../validation/sheep.schemas';
import { Request, Response } from 'express';

import { SheepCharacteristic } from '../../model/sheep.model';
import { ZodError } from 'zod';
import sheepService from '../../service/sheep.service';

export async function createCharacteristic(req: Request, res: Response) {
  let characteristicData: CreateCharacteristicSchema;
  let newCharacteristic: SheepCharacteristic;

  try {
    characteristicData = await createCharacteristicSchema.parseAsync(req.body);
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
    newCharacteristic = await sheepService.createCharacteristic(
      characteristicData
    );
    res.status(200).json(newCharacteristic);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
