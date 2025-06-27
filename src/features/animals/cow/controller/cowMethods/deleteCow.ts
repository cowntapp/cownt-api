import { Request, Response } from 'express';

import { Types } from 'mongoose';
import cowService from '../../service/cow.service';

export async function deleteCow(req: Request, res: Response) {
  const { cowId } = req.params;
  if (!Types.ObjectId.isValid(cowId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  try {
    const deletedCow = await cowService.deleteCow(cowId);
    if (!deletedCow) {
      res.status(404).json({ message: `Cow with id ${cowId} does not exist` });
      return;
    }

    res
      .status(200)
      .json({ message: `Cow with id ${cowId} deleted successfully` });
    return;
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: 'Database connection error' });
    return;
  }
}
