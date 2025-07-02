import { Request, Response } from 'express';

import { Types } from 'mongoose';
import sheepService from '../../service/sheep.service';

export async function deleteCharacteristic(req: Request, res: Response) {
  const { characteristicId } = req.params;
  if (!Types.ObjectId.isValid(characteristicId)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  try {
    const deletedCharacteristic = await sheepService.deleteCharacteristic(
      characteristicId
    );
    if (!deletedCharacteristic) {
      res.status(404).json({ message: 'Characteristic not found' });
      return;
    }

    res.status(200).json({
      message: `Characteristic with id ${characteristicId} deleted successfully`,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}
