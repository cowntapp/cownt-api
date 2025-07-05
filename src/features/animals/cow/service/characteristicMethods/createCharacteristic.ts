import { CONFLICT } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import {
  CowCharacteristic,
  CowCharacteristicModel,
} from '../../model/cow.model';

import { CreateCharacteristicSchema } from '../../validation/cow.schemas';
import { checkCharacteristicExistsByValue } from '../utils/validations';

export async function createCharacteristic(
  characteristicData: CreateCharacteristicSchema
) {
  const characteristicExists = await checkCharacteristicExistsByValue(
    characteristicData.value
  );
  appAssert(!characteristicExists, CONFLICT, 'Characteristic already exists');

  const newCharacteristic: CowCharacteristic =
    await CowCharacteristicModel.create(characteristicData);
  return newCharacteristic;
}
