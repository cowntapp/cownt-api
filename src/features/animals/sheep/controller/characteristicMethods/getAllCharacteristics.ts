import { Request, Response } from 'express';

import sheepService from '../../service/sheep.service';

export async function getAllCharacteristics(req: Request, res: Response) {
  try {
    const allCharacteristics = await sheepService.getAllCharacteristics();
    res.status(200).json(allCharacteristics);
    return;
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: 'Database error' });
    return;
  }
}
