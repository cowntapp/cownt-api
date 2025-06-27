import CowModel, {
  CowCharacteristic,
  CowCharacteristicModel,
} from '../../model/cow.model';

import mongoose from 'mongoose';

export async function deleteCharacteristic(characteristicId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const deletedCharacteristic: CowCharacteristic | null =
      await CowCharacteristicModel.findByIdAndDelete(characteristicId).session(
        session
      );
    if (!deletedCharacteristic) {
      await session.abortTransaction();
      await session.endSession();
      return null;
    }

    // find cows which have deletedCharacteristic in characteristics array and delete this characteristic from this array
    await CowModel.updateMany(
      { characteristics: characteristicId },
      { $pull: { characteristics: characteristicId } }
    ).session(session);

    await session.commitTransaction();
    await session.endSession();
    return deletedCharacteristic;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
}
