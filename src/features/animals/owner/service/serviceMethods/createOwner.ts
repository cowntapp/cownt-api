import { CONFLICT } from '../../../../../lib/constants/http';
import appAssert from '../../../../../lib/utils/appAssert';
import { checkOwnerExistsByValue } from '../../../sheep/service/utils/validations';
import { Owner, OwnerModel } from '../../model/owner.model';
import { CreateOwnerSchema } from '../../validation/owner.schemas';

export async function createOwner(ownerData: CreateOwnerSchema) {
  const ownerExists = await checkOwnerExistsByValue(ownerData.value);
  appAssert(!ownerExists, CONFLICT, 'Owner already exists');

  const newOwner: Owner = await OwnerModel.create(ownerData);
  return newOwner;
}
