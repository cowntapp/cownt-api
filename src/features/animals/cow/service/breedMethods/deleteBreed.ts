import CowModel, { CowBreedModel } from '../../model/cow.model';

import mongoose from 'mongoose';

export async function deleteBreed(breedId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedBreed = await CowBreedModel.findByIdAndDelete(breedId).session(
      session
    );
    if (!deletedBreed) {
      // If breed is not found, abort transaction and return null
      await session.abortTransaction();
      await session.endSession();
      return null;
    }

    // updates every cow with deleted breed
    await CowModel.updateMany(
      { breed: breedId },
      { $set: { breed: null } }
    ).session(session);

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
