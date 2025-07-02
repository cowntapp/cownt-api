import {
  createBreed,
  deleteBreed,
  getAllBreeds,
  updateBreed,
} from './breedMethods';
import {
  createCharacteristic,
  deleteCharacteristic,
  getAllCharacteristics,
  updateCharacteristic,
} from './characteristicMethods';
import {
  createSheep,
  deleteSheep,
  getAllSheeps,
  getSheepById,
  getSheepsWithStatistics,
  updateSheep,
} from './sheepMethods';

const service = {
  // Sheep methods
  getAllSheeps,
  getSheepById,
  createSheep,
  deleteSheep,
  updateSheep,

  // Statistics methods
  getSheepsWithStatistics,

  // Breed methods
  getAllBreeds,
  createBreed,
  deleteBreed,
  updateBreed,

  // Characteristic methods
  getAllCharacteristics,
  createCharacteristic,
  deleteCharacteristic,
  updateCharacteristic,
};

export default service;
