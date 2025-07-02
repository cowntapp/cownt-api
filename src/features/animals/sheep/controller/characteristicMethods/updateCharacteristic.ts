import { Request, Response } from 'express';
import {
  UpdateCharacteristicSchema,
  updateCharacteristicSchema,
} from '../../validation/sheep.schemas';

import { SheepCharacteristic } from '../../model/sheep.model';
import { Types } from 'mongoose';
import { ZodError } from 'zod';
import sheepService from '../../service/sheep.service';

export async function updateCharacteristic(req: Request, res: Response) {
  const { characteristicId } = req.params;
  if (!Types.ObjectId.isValid(characteristicId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  let characteristicData: UpdateCharacteristicSchema;
  let updatedCharacteristic: SheepCharacteristic | null;

  try {
    characteristicData = await updateCharacteristicSchema.parseAsync(req.body);
    if (Object.entries(characteristicData).length === 0) {
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
    updatedCharacteristic = await sheepService.updateCharacteristic(
      characteristicId,
      characteristicData
    );

    if (!updatedCharacteristic) {
      res.status(404).json({ message: 'Characteristic not found' });
      return;
    }

    res.status(200).json(updatedCharacteristic);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
