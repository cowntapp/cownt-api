import { Request, Response } from 'express';
import { Types } from 'mongoose';
import {
  updateOwnerSchema,
  UpdateOwnerSchema,
} from '../../validation/owner.schemas';
import { Owner } from '../../model/owner.model';
import { ZodError } from 'zod';
import ownerService from '../../service/owner.service';

export async function updateOwner(req: Request, res: Response) {
  const { ownerId } = req.params;
  if (!Types.ObjectId.isValid(ownerId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  let ownerData: UpdateOwnerSchema;
  let updatedOwner: Owner | null;

  try {
    ownerData = await updateOwnerSchema.parseAsync(req.body);
    if (Object.entries(ownerData).length === 0) {
      res.status(400).json({ message: 'No valid data found' });
      return;
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(error.issues);
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
    return;
  }

  try {
    updatedOwner = await ownerService.updateOwner(ownerId, ownerData);

    if (!updatedOwner) {
      res.status(404).json({ message: 'Owner not found' });
      return;
    }

    res.status(200).json(updatedOwner);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
