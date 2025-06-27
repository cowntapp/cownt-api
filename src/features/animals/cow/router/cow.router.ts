import { Router } from 'express';
import cowController from '../controller/cow.controller';

const router = Router();

// breed routes
router.get('/breeds', cowController.getAllBreeds);
router.post('/breeds', cowController.createBreed);
router.patch('/breeds/:breedId', cowController.updateBreed);
router.delete('/breeds/:breedId', cowController.deleteBreed);

// characteristic routes
router.get('/characteristics', cowController.getAllCharacteristics);
router.post('/characteristics', cowController.createCharacteristic);
router.patch(
  '/characteristics/:characteristicId',
  cowController.updateCharacteristic
);
router.delete(
  '/characteristics/:characteristicId',
  cowController.deleteCharacteristic
);

// cow with statistics routes
router.get('/cows-with-statistics', cowController.getCowsWithStatistics);

// cow routes
router.get('/', cowController.getAllCows);
router.get('/:cowId', cowController.getCowById);
router.post('/', cowController.createCow);
router.patch('/:cowId', cowController.updateCow);
router.delete('/:cowId', cowController.deleteCow);

export default router;
