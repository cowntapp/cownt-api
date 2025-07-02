import {
  SheepCharacteristic,
  SheepCharacteristicModel,
} from '../../model/sheep.model';

export async function getAllCharacteristics() {
  const characteristics: SheepCharacteristic[] =
    await SheepCharacteristicModel.find({});
  return characteristics;
}
