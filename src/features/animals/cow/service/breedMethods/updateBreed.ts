import { CowBreed, CowBreedModel } from '../../model/cow.model';

import { UpdateBreedSchema } from '../../validation/cow.schemas';

export async function updateBreed(
  breedId: string,
  breedData: UpdateBreedSchema
) {
  // No need for transaction as animal only contains breedId
  const updatedBreed: CowBreed | null = await CowBreedModel.findByIdAndUpdate(
    breedId,
    breedData,
    { returnDocument: 'after' }
  );
  return updatedBreed;
}
