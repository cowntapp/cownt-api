import { Types } from 'mongoose';
import SheepModel, {
  SheepBreedModel,
  SheepCharacteristicModel,
} from '../../model/sheep.model';

export async function checkSheepExistsById(id: string) {
  const isValid = Types.ObjectId.isValid(id);
  if (!isValid) {
    return false;
  }
  const sheep = await SheepModel.findById(id);
  return sheep !== null;
}
export async function checkSheepExistsByLongCode(longCode: string) {
  const sheep = await SheepModel.findOne({ longCode });
  return sheep !== null;
}

export async function checkBreedExistsById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    return false;
  }
  const breed = await SheepBreedModel.findById(id);
  return breed !== null;
}
export async function checkBreedExistsByValue(value: string) {
  const breed = await SheepBreedModel.findOne({ value });
  return breed !== null;
}

export async function checkCharacteristicExistsById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    return false;
  }
  const characteristic = await SheepCharacteristicModel.findById(id);
  return characteristic !== null;
}
export async function checkCharacteristicExistsByValue(value: string) {
  const characteristic = await SheepCharacteristicModel.findOne({ value });
  return characteristic !== null;
}
