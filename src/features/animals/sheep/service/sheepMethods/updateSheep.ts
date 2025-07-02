import SheepModel, { Sheep } from '../../model/sheep.model';

import { UpdateSheepSchema } from '../../validation/sheep.schemas';

export async function updateSheep(
  sheepId: string,
  sheepData: UpdateSheepSchema
) {
  // TODO: backend validations
  const updatedSheep: Sheep | null = await SheepModel.findByIdAndUpdate(
    sheepId,
    sheepData,
    { returnDocument: 'after' }
  );
  return updatedSheep;
}
