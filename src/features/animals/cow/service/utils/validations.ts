import { Types } from 'mongoose';
import CowModel, {
  CowBreedModel,
  CowCharacteristicModel,
} from '../../model/cow.model';

export async function checkCowExistsById(id: string) {
  const isValid = Types.ObjectId.isValid(id);
  if (!isValid) {
    return false;
  }
  const cow = await CowModel.findById(id);
  return cow !== null;
}
export async function checkCowExistsByLongCode(longCode: string) {
  const cow = await CowModel.findOne({ longCode });
  return cow !== null;
}

export async function checkBreedExistsById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    return false;
  }
  const breed = await CowBreedModel.findById(id);
  return breed !== null;
}
export async function checkBreedExistsByValue(value: string) {
  const breed = await CowBreedModel.findOne({ value });
  return breed !== null;
}

export async function checkCharacteristicExistsById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    return false;
  }
  const characteristic = await CowCharacteristicModel.findById(id);
  return characteristic !== null;
}
export async function checkCharacteristicExistsByValue(value: string) {
  const characteristic = await CowCharacteristicModel.findOne({ value });
  return characteristic !== null;
}
