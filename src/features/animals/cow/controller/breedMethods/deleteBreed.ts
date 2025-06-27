import { Request, Response } from 'express';

import { Types } from 'mongoose';
import cowService from '../../service/cow.service';

export async function deleteBreed(req: Request, res: Response) {
  const { breedId } = req.params;
  if (!Types.ObjectId.isValid(breedId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  try {
    const deletedBreed = await cowService.deleteBreed(breedId);
    if (!deletedBreed) {
      res.status(404).json({ message: 'Breed not found' });
      return;
    }

    res
      .status(200)
      .json({ message: `Breed with id ${breedId} deleted successfully` });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
