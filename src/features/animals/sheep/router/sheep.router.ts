import { Router } from 'express';
import sheepController from '../controller/sheep.controller';

const router = Router();

// breed routes
router.get('/breeds', sheepController.getAllBreeds);
router.post('/breeds', sheepController.createBreed);
router.patch('/breeds/:breedId', sheepController.updateBreed);
router.delete('/breeds/:breedId', sheepController.deleteBreed);

// characteristic routes
router.get('/characteristics', sheepController.getAllCharacteristics);
router.post('/characteristics', sheepController.createCharacteristic);
router.patch(
  '/characteristics/:characteristicId',
  sheepController.updateCharacteristic
);
router.delete(
  '/characteristics/:characteristicId',
  sheepController.deleteCharacteristic
);

// sheep with statistics routes
router.get('/sheeps-with-statistics', sheepController.getSheepsWithStatistics);

// sheep routes
router.get('/', sheepController.getAllSheeps);
router.get('/:sheepId', sheepController.getSheepById);
router.post('/', sheepController.createSheep);
router.patch('/:sheepId', sheepController.updateSheep);
router.delete('/:sheepId', sheepController.deleteSheep);

export default router;
