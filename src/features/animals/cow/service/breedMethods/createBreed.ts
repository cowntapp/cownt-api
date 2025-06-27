import { CowBreed, CowBreedModel } from '../../model/cow.model';
import { CreateBreedSchema } from '../../validation/cow.schemas';

export async function createBreed(breedData: CreateBreedSchema) {
  const newBreed: CowBreed = await CowBreedModel.create(breedData);
  return newBreed;
}
