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
  createCow,
  deleteCow,
  getAllCows,
  getCowById,
  getCowsWithStatistics,
  updateCow,
} from './cowMethods';

const controller = {
  // Cow methods
  getAllCows,
  getCowById,
  createCow,
  deleteCow,
  updateCow,

  // Statistics methods
  getCowsWithStatistics,

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

export default controller;
