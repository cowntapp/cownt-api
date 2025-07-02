import { Request, Response } from 'express';

import sheepService from '../../service/sheep.service';

export const getSheepsWithStatistics = async (req: Request, res: Response) => {
  try {
    const sheepsWithStatistics = await sheepService.getSheepsWithStatistics();
    res.status(200).json(sheepsWithStatistics);
    return;
  } catch (error) {
    res.status(503).json({ message: 'Database error' });
    return;
  }
};
