import { CONFLICT } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import { CowBreed, CowBreedModel } from '../../model/cow.model';

import { UpdateBreedSchema } from '../../validation/cow.schemas';

export async function updateBreed(
  breedId: string,
  breedData: UpdateBreedSchema
) {
  const exitingBreed = await CowBreedModel.find({ value: breedData.value });
  appAssert(
    exitingBreed.length === 0,
    CONFLICT,
    `Breed ${breedData.value} already exists`
  );

  // No need for transaction as animal only contains breedId
  const updatedBreed: CowBreed | null = await CowBreedModel.findByIdAndUpdate(
    breedId,
    breedData,
    { returnDocument: 'after' }
  );
  return updatedBreed;
}
