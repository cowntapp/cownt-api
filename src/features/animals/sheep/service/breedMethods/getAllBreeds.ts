import { SheepBreed, SheepBreedModel } from '../../model/sheep.model';

export async function getAllBreeds() {
  const breeds: SheepBreed[] = await SheepBreedModel.find({});
  return breeds;
}
