import {
  CowCharacteristic,
  CowCharacteristicModel,
} from '../../model/cow.model';

import { CreateCharacteristicSchema } from '../../validation/cow.schemas';

export async function createCharacteristic(
  characteristicData: CreateCharacteristicSchema
) {
  const newCharacteristic: CowCharacteristic =
    await CowCharacteristicModel.create(characteristicData);
  return newCharacteristic;
}
