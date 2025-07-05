import { CONFLICT } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import {
  SheepCharacteristic,
  SheepCharacteristicModel,
} from '../../model/sheep.model';

import { UpdateCharacteristicSchema } from '../../validation/sheep.schemas';
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

  const updatedCharacteristic: SheepCharacteristic | null =
    await SheepCharacteristicModel.findByIdAndUpdate(
      characteristicId,
      characteristicData,
      { returnDocument: 'after' }
    );
  return updatedCharacteristic;
}
