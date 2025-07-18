import { CONFLICT, NOT_FOUND } from '../../../../../lib/constants/http';
import AppError from '../../../../../lib/utils/AppError';

import mongoose from 'mongoose';
import SheepModel from '../../../sheep/model/sheep.model';
import { OwnerModel } from '../../model/owner.model';
import CowModel from '../../../cow/model/cow.model';

export async function deleteOwner(ownerId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sheepsWithOwner = await SheepModel.find({ owner: ownerId }).session(
      session
    );
    const cowsWithOwner = await CowModel.find({ owner: ownerId }).session(
      session
    );

    if (sheepsWithOwner.length > 0) {
      throw new AppError(CONFLICT, `Existing sheeps with owner ${ownerId}`);
    }
    if (cowsWithOwner.length > 0) {
      throw new AppError(CONFLICT, `Existing cows with owner ${ownerId}`);
    }

    const deletedOwner = await OwnerModel.findByIdAndDelete(ownerId).session(
      session
    );
    if (!deletedOwner) {
      // If breed is not found, abort transaction and return null
      throw new AppError(NOT_FOUND, `Owner with id ${ownerId} is not found`);
    }

    // confims transaction
    await session.commitTransaction();
    await session.endSession();
    return deletedOwner;
  } catch (error) {
    // if error, abort transaction and propagate error
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
}
