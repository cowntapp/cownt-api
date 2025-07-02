import {
  SheepCharacteristic,
  SheepCharacteristicModel,
} from '../../model/sheep.model';

import { CreateCharacteristicSchema } from '../../validation/sheep.schemas';

export async function createCharacteristic(
  characteristicData: CreateCharacteristicSchema
) {
  const newCharacteristic: SheepCharacteristic =
    await SheepCharacteristicModel.create(characteristicData);
  return newCharacteristic;
}
