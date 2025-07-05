import { CONFLICT } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import { CowBreed, CowBreedModel } from '../../model/cow.model';

import { UpdateBreedSchema } from '../../validation/cow.schemas';
import { checkBreedExistsByValue } from '../utils/validations';

export async function updateBreed(
  breedId: string,
  breedData: UpdateBreedSchema
) {
  const exitingBreed = await checkBreedExistsByValue(breedData.value);
  appAssert(!exitingBreed, CONFLICT, `Breed ${breedData.value} already exists`);

  // No need for transaction as animal only contains breedId
  const updatedBreed: CowBreed | null = await CowBreedModel.findByIdAndUpdate(
    breedId,
    breedData,
    { returnDocument: 'after' }
  );
  return updatedBreed;
}
