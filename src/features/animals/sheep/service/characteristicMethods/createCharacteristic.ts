import { CONFLICT } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import {
  SheepCharacteristic,
  SheepCharacteristicModel,
} from '../../model/sheep.model';

import { CreateCharacteristicSchema } from '../../validation/sheep.schemas';
import { checkCharacteristicExistsByValue } from '../utils/validations';

export async function createCharacteristic(
  characteristicData: CreateCharacteristicSchema
) {
  const characteristicExists = await checkCharacteristicExistsByValue(
    characteristicData.value
  );
  appAssert(!characteristicExists, CONFLICT, 'Characteristic already exists');

  const newCharacteristic: SheepCharacteristic =
    await SheepCharacteristicModel.create(characteristicData);
  return newCharacteristic;
}
