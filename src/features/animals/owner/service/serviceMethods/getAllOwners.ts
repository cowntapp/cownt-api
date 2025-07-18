import { Owner, OwnerModel } from '../../model/owner.model';

export async function getAllOwners() {
  const owners: Owner[] = await OwnerModel.find({});
  return owners;
}
