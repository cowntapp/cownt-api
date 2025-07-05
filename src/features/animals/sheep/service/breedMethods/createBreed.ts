import { CONFLICT } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import { SheepBreed, SheepBreedModel } from '../../model/sheep.model';
import { CreateBreedSchema } from '../../validation/sheep.schemas';
import { checkBreedExistsByValue } from '../utils/validations';

export async function createBreed(breedData: CreateBreedSchema) {
  const breedExists = await checkBreedExistsByValue(breedData.value);
  appAssert(!breedExists, CONFLICT, 'Breed already exists');

  const newBreed: SheepBreed = await SheepBreedModel.create(breedData);
  return newBreed;
}
