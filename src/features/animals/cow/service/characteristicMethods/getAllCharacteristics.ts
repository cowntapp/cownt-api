import {
  CowCharacteristic,
  CowCharacteristicModel,
} from '../../model/cow.model';

export async function getAllCharacteristics() {
  const characteristics: CowCharacteristic[] =
    await CowCharacteristicModel.find({});
  return characteristics;
}
