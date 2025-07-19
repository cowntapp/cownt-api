import CowModel, { Cow } from '../../model/cow.model';

export async function getCowById(cowId: string) {
  const cow: Cow | null = await CowModel.findById(cowId).populate([
    'breed',
    'characteristics',
    'owner',
    'mother',
    'children',
  ]);
  return cow;
}
