import { CONFLICT } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import { SheepBreed, SheepBreedModel } from '../../model/sheep.model';

import { UpdateBreedSchema } from '../../validation/sheep.schemas';

export async function updateBreed(
  breedId: string,
  breedData: UpdateBreedSchema
) {
  const existingBreed = await SheepBreedModel.find({ value: breedData.value });
  appAssert(
    existingBreed.length === 0,
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
