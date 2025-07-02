import SheepModel, { Sheep } from '../../model/sheep.model';

export async function getAllSheeps() {
  const allSheeps: Sheep[] = await SheepModel.find({});
  return allSheeps;
}
