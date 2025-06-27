import CowModel, { Cow } from '../../model/cow.model';

import { UpdateCowSchema } from '../../validation/cow.schemas';

export async function updateCow(cowId: string, cowData: UpdateCowSchema) {
  // TODO: backend validations
  const updatedCow: Cow | null = await CowModel.findByIdAndUpdate(
    cowId,
    cowData,
    { returnDocument: 'after' }
  );
  return updatedCow;
}
