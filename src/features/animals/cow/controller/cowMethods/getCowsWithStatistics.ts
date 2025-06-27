import { Request, Response } from 'express';

import cowService from '../../service/cow.service';

export const getCowsWithStatistics = async (req: Request, res: Response) => {
  try {
    const cowsWithStatistics = await cowService.getCowsWithStatistics();
    res.status(200).json(cowsWithStatistics);
    return;
  } catch (error) {
    res.status(503).json({ message: 'Database error' });
    return;
  }
};
