import {
  CowCharacteristic,
  CowCharacteristicModel,
} from '../../model/cow.model';

import { UpdateCharacteristicSchema } from '../../validation/cow.schemas';

export async function updateCharacteristic(
  characteristicId: string,
  characteristicData: UpdateCharacteristicSchema
) {
  const updatedCharacteristic: CowCharacteristic | null =
    await CowCharacteristicModel.findByIdAndUpdate(
      characteristicId,
      characteristicData,
      { returnDocument: 'after' }
    );
  return updatedCharacteristic;
}
