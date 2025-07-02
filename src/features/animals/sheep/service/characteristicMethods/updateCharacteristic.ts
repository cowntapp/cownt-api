import {
  SheepCharacteristic,
  SheepCharacteristicModel,
} from '../../model/sheep.model';

import { UpdateCharacteristicSchema } from '../../validation/sheep.schemas';

export async function updateCharacteristic(
  characteristicId: string,
  characteristicData: UpdateCharacteristicSchema
) {
  const updatedCharacteristic: SheepCharacteristic | null =
    await SheepCharacteristicModel.findByIdAndUpdate(
      characteristicId,
      characteristicData,
      { returnDocument: 'after' }
    );
  return updatedCharacteristic;
}
