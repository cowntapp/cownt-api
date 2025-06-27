import { CowBreed, CowBreedModel } from '../../model/cow.model';

import { UpdateBreedSchema } from '../../validation/cow.schemas';

export async function updateBreed(
  breedId: string,
  breedData: UpdateBreedSchema
) {
  const updatedBreed: CowBreed | null = await CowBreedModel.findByIdAndUpdate(
    breedId,
    breedData,
    { returnDocument: 'after' }
  );
  return updatedBreed;
}
