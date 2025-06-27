import { CowBreed, CowBreedModel } from '../../model/cow.model';

export async function getAllBreeds() {
  const breeds: CowBreed[] = await CowBreedModel.find({});
  return breeds;
}
