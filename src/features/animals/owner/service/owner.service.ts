import { createOwner } from './serviceMethods/createOwner';
import { deleteOwner } from './serviceMethods/deleteOwner';
import { getAllOwners } from './serviceMethods/getAllOwners';
import { updateOwner } from './serviceMethods/updateOwner';

const service = {
  createOwner,
  deleteOwner,
  getAllOwners,
  updateOwner,
};

export default service;
