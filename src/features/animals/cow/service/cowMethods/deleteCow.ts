import CowModel, { Cow } from '../../model/cow.model';

import mongoose from 'mongoose';

export async function deleteCow(cowId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedCow: Cow | null = await CowModel.findByIdAndDelete(
      cowId
    ).session(session);

    if (!deletedCow) {
      await session.abortTransaction();
      await session.endSession();
      return null;
    }

    if (!deletedCow.mother) {
      await session.commitTransaction();
      await session.endSession();
      return deletedCow;
    }

    // set mother prop to null on all children
    await CowModel.updateMany(
      { mother: cowId },
      { $set: { mother: null } }
    ).session(session);
    // delete from children array of the mother
    await CowModel.updateMany(
      { children: cowId },
      { $pull: { children: cowId } }
    ).session(session);

    await session.commitTransaction();
    await session.endSession();
    return deletedCow;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
}
