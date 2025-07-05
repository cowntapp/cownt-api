import { CONFLICT } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import { CowBreed, CowBreedModel } from '../../model/cow.model';
import { CreateBreedSchema } from '../../validation/cow.schemas';
import { checkBreedExistsByValue } from '../utils/validations';

export async function createBreed(breedData: CreateBreedSchema) {
  const breedExsits = await checkBreedExistsByValue(breedData.value);
  appAssert(!breedExsits, CONFLICT, 'Breed already exists');

  const newBreed: CowBreed = await CowBreedModel.create(breedData);
  return newBreed;
}
