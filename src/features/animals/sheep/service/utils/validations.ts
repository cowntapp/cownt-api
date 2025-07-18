import { Types } from 'mongoose';
import SheepModel, {
  SheepBreedModel,
  SheepCharacteristicModel,
} from '../../model/sheep.model';
import { OwnerModel } from '../../../owner/model/owner.model';

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

export async function checkOwnerExistsById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    return false;
  }
  const owner = await OwnerModel.findById(id);
  return owner !== null;
}
export async function checkOwnerExistsByValue(value: string) {
  const owner = await OwnerModel.findOne({ value });
  return owner !== null;
}
