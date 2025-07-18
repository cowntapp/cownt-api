import { Request, Response } from 'express';
import { Types } from 'mongoose';
import ownerService from '../../service/owner.service';

export async function deleteOwner(req: Request, res: Response) {
  const { ownerId } = req.params;
  if (!Types.ObjectId.isValid(ownerId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  try {
    const deletedOwner = await ownerService.deleteOwner(ownerId);
    if (!deletedOwner) {
      res.status(404).json({ message: 'Owner not found' });
      return;
    }

    res
      .status(200)
      .json({ message: `Owner with id ${ownerId} deleted successfully` });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
