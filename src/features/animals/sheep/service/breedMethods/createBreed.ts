import { SheepBreed, SheepBreedModel } from '../../model/sheep.model';
import { CreateBreedSchema } from '../../validation/sheep.schemas';

export async function createBreed(breedData: CreateBreedSchema) {
  const newBreed: SheepBreed = await SheepBreedModel.create(breedData);
  return newBreed;
}
