import { Request, Response } from 'express';

import { Types } from 'mongoose';
import sheepService from '../../service/sheep.service';

export async function deleteSheep(req: Request, res: Response) {
  const { sheepId } = req.params;
  if (!Types.ObjectId.isValid(sheepId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  try {
    const deletedSheep = await sheepService.deleteSheep(sheepId);
    if (!deletedSheep) {
      res
        .status(404)
        .json({ message: `Sheep with id ${sheepId} does not exist` });
      return;
    }

    res
      .status(200)
      .json({ message: `Sheep with id ${sheepId} deleted successfully` });
    return;
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: 'Database connection error' });
    return;
  }
}
