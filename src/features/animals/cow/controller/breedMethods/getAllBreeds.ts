import { Request, Response } from 'express';

import cowService from '../../service/cow.service';

export async function getAllBreeds(req: Request, res: Response) {
  try {
    const allBreeds = await cowService.getAllBreeds();
    res.status(200).json(allBreeds);
    return;
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: 'Database error' });
    return;
  }
}
