import { Request, Response } from 'express';

import sheepService from '../../service/sheep.service';

export async function getAllBreeds(req: Request, res: Response) {
  try {
    const allBreeds = await sheepService.getAllBreeds();
    res.status(200).json(allBreeds);
    return;
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: 'Database error' });
    return;
  }
}
