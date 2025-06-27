import CowModel, { Cow } from '../../model/cow.model';

export async function getAllCows() {
  const allCows: Cow[] = await CowModel.find({});
  return allCows;
}
