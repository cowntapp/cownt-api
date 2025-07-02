import { SheepBreed, SheepBreedModel } from '../../model/sheep.model';

import { UpdateBreedSchema } from '../../validation/sheep.schemas';

export async function updateBreed(
  breedId: string,
  breedData: UpdateBreedSchema
) {
  const updatedBreed: SheepBreed | null =
    await SheepBreedModel.findByIdAndUpdate(breedId, breedData, {
      returnDocument: 'after',
    });
  return updatedBreed;
}
