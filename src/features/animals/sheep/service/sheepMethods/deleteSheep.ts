import SheepModel, { Sheep } from '../../model/sheep.model';

import mongoose from 'mongoose';

export async function deleteSheep(sheepId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedSheep: Sheep | null = await SheepModel.findByIdAndDelete(
      sheepId
    ).session(session);

    if (!deletedSheep) {
      await session.abortTransaction();
      await session.endSession();
      return null;
    }

    if (!deletedSheep.mother) {
      await session.commitTransaction();
      await session.endSession();
      return deletedSheep;
    }

    // set mother prop to null on all children
    await SheepModel.updateMany(
      { mother: sheepId },
      { $set: { mother: null } }
    ).session(session);
    // delete from children array of the mother
    await SheepModel.updateMany(
      { children: sheepId },
      { $pull: { children: sheepId } }
    ).session(session);

    await session.commitTransaction();
    await session.endSession();
    return deletedSheep;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
}
