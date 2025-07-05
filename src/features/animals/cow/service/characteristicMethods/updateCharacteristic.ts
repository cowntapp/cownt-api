import { CONFLICT } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import {
  CowCharacteristic,
  CowCharacteristicModel,
} from '../../model/cow.model';

import { UpdateCharacteristicSchema } from '../../validation/cow.schemas';
import { checkCharacteristicExistsByValue } from '../utils/validations';

export async function updateCharacteristic(
  characteristicId: string,
  characteristicData: UpdateCharacteristicSchema
) {
  const existingCharacteristic = await checkCharacteristicExistsByValue(
    characteristicData.value
  );
  appAssert(
    !existingCharacteristic,
    CONFLICT,
    `Characteristic ${characteristicData.value} already exists`
  );

  const updatedCharacteristic: CowCharacteristic | null =
    await CowCharacteristicModel.findByIdAndUpdate(
      characteristicId,
      characteristicData,
      { returnDocument: 'after' }
    );
  return updatedCharacteristic;
}
