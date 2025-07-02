import SheepModel, { Sheep } from '../../model/sheep.model';

export async function getSheepById(sheepId: string) {
  const sheep: Sheep | null = await SheepModel.findById(sheepId).populate([
    'breed',
    'characteristics',
    'mother',
    'children',
  ]);
  return sheep;
}
