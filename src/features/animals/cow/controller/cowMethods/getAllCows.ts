import { Request, Response } from 'express';

import { Cow } from '../../model/cow.model';
import cowService from '../../service/cow.service';

export async function getAllCows(req: Request, res: Response) {
  try {
    const allCows: Cow[] = await cowService.getAllCows();
    res.status(200).json(allCows);
    return;
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: 'Database error' });
    return;
  }
}
