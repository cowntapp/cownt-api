import CowModel, { Cow } from '../../model/cow.model';
import {
  checkBreedExistsById,
  checkCharacteristicExistsById,
  checkCowExistsByLongCode,
} from '../utils/validations';

import { CreateCowSchema } from '../../validation/cow.schemas';
import { CustomError } from '../../../../../errors/customError';
import mongoose from 'mongoose';
import { COW_SHORT_CODE_LAST_CHARS_NUM } from '../../consts';
import { ORIGIN } from '../../../animalsConsts';

export async function createCow(cowData: CreateCowSchema) {
  const { longCode, breed, characteristics } = cowData;
  const cowExists = await checkCowExistsByLongCode(longCode);
  const breedExists = await checkBreedExistsById(breed);
  const allCharacteristicsExists = characteristics
    ? (
        await Promise.all(
          characteristics.map((char) => checkCharacteristicExistsById(char))
        )
      ).every((res) => res === true)
    : true;

  if (cowExists) {
    throw new CustomError({
      message: 'Cow already exists',
      statusCode: 409,
      status: 'Conflict',
    });
  }
  if (!breedExists || !allCharacteristicsExists) {
    throw new CustomError({
      message: 'Breed or Characteristic do not exist',
      statusCode: 404,
      status: 'Not Found',
    });
  }
  const shortCode = longCode.slice(-COW_SHORT_CODE_LAST_CHARS_NUM);

  const newCow = { ...cowData, shortCode };
  let createdCow: Cow;

  /**
   * Animal could be bought or born
   * - if animal is born, mother must be passed
   * - if animal is bought mother must not be passed
   *
   * if mother is passed, the child (current animal) must be added to it's children arrays
   */
  if (!newCow.mother && newCow.origin === ORIGIN.BOUGHT) {
    // if none is passed the animal we only create the animal document
    createdCow = await CowModel.create(newCow);
  } else if (newCow.mother && newCow.origin === ORIGIN.BORN) {
    // both are passed so must update father and mother documents
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      createdCow = await CowModel.create([newCow], { session })[0];

      // updating mother births
      await CowModel.updateMany(
        { _id: newCow.mother },
        { $push: { children: createdCow._id } }
      ).session(session);

      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  } else {
    throw new Error('Internal server error');
  }

  return createdCow;
}
