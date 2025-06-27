import { Request, Response } from 'express';

import { Cow } from '../../model/cow.model';
import { Types } from 'mongoose';
import cowService from '../../service/cow.service';

export async function getCowById(req: Request, res: Response) {
  const { cowId } = req.params;
  if (!Types.ObjectId.isValid(cowId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  let cow: Cow | null;

  try {
    cow = await cowService.getCowById(cowId);

    if (!cow) {
      res.status(404).json({ message: `Cow with id ${cowId} not found` });
      return;
    }

    res.status(200).json(cow);
    return;
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: 'Database connection error' });
    return;
  }
}
