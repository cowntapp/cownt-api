import { Request, Response } from 'express';

import { Sheep } from '../../model/sheep.model';
import { Types } from 'mongoose';
import sheepService from '../../service/sheep.service';

export async function getSheepById(req: Request, res: Response) {
  const { sheepId } = req.params;
  if (!Types.ObjectId.isValid(sheepId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  let sheep: Sheep | null;

  try {
    sheep = await sheepService.getSheepById(sheepId);

    if (!sheep) {
      res.status(404).json({ message: `Sheep with id ${sheepId} not found` });
      return;
    }

    res.status(200).json(sheep);
    return;
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: 'Database connection error' });
    return;
  }
}
