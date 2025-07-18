import { CONFLICT } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import { checkOwnerExistsByValue } from '../../../sheep/service/utils/validations';
import { Owner, OwnerModel } from '../../model/owner.model';
import { UpdateOwnerSchema } from '../../validation/owner.schemas';

export async function updateOwner(
  ownerId: string,
  ownerData: UpdateOwnerSchema
) {
  const existingOwner = await checkOwnerExistsByValue(ownerData.value);
  appAssert(
    !existingOwner,
    CONFLICT,
    `Owner ${ownerData.value} already exists`
  );

  // No need for transaction as animal only contains breedId
  const updatedOwner: Owner | null = await OwnerModel.findByIdAndUpdate(
    ownerId,
    ownerData,
    {
      returnDocument: 'after',
    }
  );
  return updatedOwner;
}
