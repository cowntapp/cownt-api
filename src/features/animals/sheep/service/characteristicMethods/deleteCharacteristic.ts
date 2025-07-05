import { CONFLICT, NOT_FOUND } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import SheepModel, {
  SheepCharacteristic,
  SheepCharacteristicModel,
} from '../../model/sheep.model';

import mongoose from 'mongoose';

export async function deleteCharacteristic(characteristicId: string) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sheepsWithCharacteristic = await SheepModel.find({
      characteristics: characteristicId,
    }).session(session);
    appAssert(
      sheepsWithCharacteristic.length === 0,
      CONFLICT,
      `Existing sheeps with characeristic ${characteristicId}`
    );

    const deletedCharacteristic: SheepCharacteristic | null =
      await SheepCharacteristicModel.findByIdAndDelete(
        characteristicId
      ).session(session);
    appAssert(
      deletedCharacteristic !== null,
      NOT_FOUND,
      `Characteristic with id ${characteristicId} is not found`
    );

    // find sheeps which have deletedCharacteristic in characteristics array and delete this characteristic from this array
    // await SheepModel.updateMany(
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
