import { Router } from 'express';
import ownerController from '../controller/owner.controller';

const router = Router();

// path /owners
router.get('/', ownerController.getAllOwners);
router.post('/', ownerController.createOwner);
router.patch('/:ownerId', ownerController.updateOwner);
router.delete('/:ownerId', ownerController.deleteOwner);

export default router;
