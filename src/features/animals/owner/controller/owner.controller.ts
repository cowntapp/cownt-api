import { createOwner } from './controllerMethods/createOwner';
import { deleteOwner } from './controllerMethods/deleteOwner';
import { getAllOwners } from './controllerMethods/getAllOwners';
import { updateOwner } from './controllerMethods/updateOwner';

const controller = {
  createOwner,
  deleteOwner,
  getAllOwners,
  updateOwner,
};

export default controller;
