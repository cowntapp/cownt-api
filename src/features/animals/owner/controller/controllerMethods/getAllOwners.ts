import { Request, Response } from 'express';
import ownerService from '../../service/owner.service';

export async function getAllOwners(req: Request, res: Response) {
  try {
    const allOwners = await ownerService.getAllOwners();
    res.status(200).json(allOwners);
    return;
  } catch (error) {
    console.error(error);
    res.status(503).json({ message: 'Database error' });
    return;
  }
}
