import { CONFLICT, NOT_FOUND } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import CowModel, {
  CowCharacteristic,
  CowCharacteristicModel,
} from '../../model/cow.model';

import mongoose from 'mongoose';

export async function deleteCharacteristic(characteristicId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cowsWithCharacteristic = await CowModel.find({
      characteristics: characteristicId,
    }).session(session);
    appAssert(
      cowsWithCharacteristic.length === 0,
      CONFLICT,
      `Existing cows with characteristic ${characteristicId}`
    );

    const deletedCharacteristic: CowCharacteristic | null =
      await CowCharacteristicModel.findByIdAndDelete(characteristicId).session(
        session
      );
    appAssert(
      deletedCharacteristic !== null,
      NOT_FOUND,
      `Characteristic with id ${characteristicId} is not found`
    );

    // find cows which have deletedCharacteristic in characteristics array and delete this characteristic from this array
    // await CowModel.updateMany(
    //   { characteristics: characteristicId },
    //   { $pull: { characteristics: characteristicId } }
    // ).session(session);

    await session.commitTransaction();
    await session.endSession();
    return deletedCharacteristic;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
}
