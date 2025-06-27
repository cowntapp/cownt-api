import {
  CreateCharacteristicSchema,
  createCharacteristicSchema,
} from '../../validation/cow.schemas';
import { Request, Response } from 'express';

import { CowCharacteristic } from '../../model/cow.model';
import { ZodError } from 'zod';
import cowService from '../../service/cow.service';

export async function createCharacteristic(req: Request, res: Response) {
  let characteristicData: CreateCharacteristicSchema;
  let newCharacteristic: CowCharacteristic;

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
    newCharacteristic = await cowService.createCharacteristic(
      characteristicData
    );
    res.status(200).json(newCharacteristic);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
