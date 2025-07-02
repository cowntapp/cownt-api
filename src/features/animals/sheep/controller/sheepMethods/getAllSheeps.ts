import { Request, Response } from 'express';

import { Sheep } from '../../model/sheep.model';
import sheepService from '../../service/sheep.service';

export async function getAllSheeps(req: Request, res: Response) {
  try {
    const allSheeps: Sheep[] = await sheepService.getAllSheeps();
    res.status(200).json(allSheeps);
    return;
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: 'Database error' });
    return;
  }
}
