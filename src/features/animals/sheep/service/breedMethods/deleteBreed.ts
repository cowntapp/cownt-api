import { CONFLICT, NOT_FOUND } from '../../../../../lib/constants/http';
import AppError from '../../../../../lib/utils/AppError';
import SheepModel, { SheepBreedModel } from '../../model/sheep.model';

import mongoose from 'mongoose';

export async function deleteBreed(breedId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sheepsWithBreed = await SheepModel.find({ breed: breedId }).session(
      session
    );
    if (sheepsWithBreed.length > 0) {
      throw new AppError(CONFLICT, `Existing sheeps with breed ${breedId}`);
    }

    const deletedBreed = await SheepBreedModel.findByIdAndDelete(
      breedId
    ).session(session);
    if (!deletedBreed) {
      // If breed is not found, abort transaction and return null
      throw new AppError(NOT_FOUND, `Breed with id ${breedId} is not found`);
    }

    // updates every sheep with deleted breed
    // await SheepModel.updateMany(
    //   { breed: breedId },
    //   { $set: { breed: null } }
    // ).session(session);

    // confims transaction
    await session.commitTransaction();
    await session.endSession();
    return deletedBreed;
  } catch (error) {
    // if error, abort transaction and propagate error
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
}
