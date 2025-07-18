import { ZodError } from 'zod';
import { Owner } from '../../model/owner.model';
import {
  createOwnerSchema,
  CreateOwnerSchema,
} from '../../validation/owner.schemas';
import { Request, Response } from 'express';
import ownerService from '../../service/owner.service';

export async function createOwner(req: Request, res: Response) {
  let ownerData: CreateOwnerSchema;
  let newOwner: Owner;

  try {
    ownerData = await createOwnerSchema.parseAsync(req.body);
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
    newOwner = await ownerService.createOwner(ownerData);
    res.status(200).json(newOwner);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
