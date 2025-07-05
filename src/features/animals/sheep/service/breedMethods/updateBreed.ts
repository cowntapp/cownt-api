import { CONFLICT } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import { SheepBreed, SheepBreedModel } from '../../model/sheep.model';

import { UpdateBreedSchema } from '../../validation/sheep.schemas';
import { checkBreedExistsByValue } from '../utils/validations';

export async function updateBreed(
  breedId: string,
  breedData: UpdateBreedSchema
) {
  const existingBreed = await checkBreedExistsByValue(breedData.value);
  appAssert(
    !existingBreed,
    CONFLICT,
    `Breed ${breedData.value} already exists`
  );

  // No need for transaction as animal only contains breedId
  const updatedBreed: SheepBreed | null =
    await SheepBreedModel.findByIdAndUpdate(breedId, breedData, {
      returnDocument: 'after',
    });
  return updatedBreed;
}
