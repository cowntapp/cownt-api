import SheepModel, { Sheep } from '../../model/sheep.model';
import {
  checkBreedExistsById,
  checkCharacteristicExistsById,
  checkSheepExistsByLongCode,
} from '../utils/validations';

import { CreateSheepSchema } from '../../validation/sheep.schemas';
import mongoose from 'mongoose';
import { SHEEP_SHORT_CODE_LAST_CHARS_NUM } from '../../consts';
import { ORIGIN } from '../../../animalsConsts';
import appAssert from '../../../../../lib/utils/appAssert';
import AppError from '../../../../../lib/utils/AppError';
import {
  CONFLICT,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} from '../../../../../lib/constants/http';
import AppErrorCode from '../../../../../lib/constants/appErrorCode';

export async function createSheep(sheepData: CreateSheepSchema) {
  const { longCode, breed, characteristics } = sheepData;

  // Check if sheep already exists
  const sheepExists = await checkSheepExistsByLongCode(longCode);
  appAssert(
    !sheepExists,
    CONFLICT,
    'Sheep already exists',
    AppErrorCode.SheepAlreadyExists
  );

  // Check if breed exists
  const breedExists = await checkBreedExistsById(breed);
  appAssert(
    breedExists,
    NOT_FOUND,
    'Breed does not exist',
    AppErrorCode.BreedNotFound
  );

  // Check if all characteristics exist
  if (characteristics) {
    const allCharacteristicsExists = (
      await Promise.all(
        characteristics.map((char) => checkCharacteristicExistsById(char))
      )
    ).every((res) => res === true);

    appAssert(
      allCharacteristicsExists,
      NOT_FOUND,
      'One or more characteristics do not exist',
      AppErrorCode.CharacteristicNotFound
    );
  }

  const shortCode = longCode.slice(-SHEEP_SHORT_CODE_LAST_CHARS_NUM);
  const newSheep = { ...sheepData, shortCode };
  let createdSheep: Sheep;

  /**
   * Animal could be bought or born
   * - if animal is born, mother must be passed
   * - if animal is bought mother must not be passed
   *
   * if mother is passed, the child (current animal) must be added to it's children arrays
   */
  if (!newSheep.mother && newSheep.origin === ORIGIN.BOUGHT) {
    // if none is passed the animal we only create the animal document
    createdSheep = await SheepModel.create(newSheep);
  } else if (newSheep.mother && newSheep.origin === ORIGIN.BORN) {
    // both are passed so must update father and mother documents
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      createdSheep = new SheepModel(newSheep);

      // updating mother births
      await SheepModel.updateMany(
        { _id: newSheep.mother },
        { $push: { children: createdSheep.id } }
      ).session(session);

      await createdSheep.save({ session });

      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  } else {
    throw new AppError(
      INTERNAL_SERVER_ERROR,
      'Invalid sheep origin for mother relationship',
      AppErrorCode.InvalidOrigin
    );
  }

  return createdSheep;
}
