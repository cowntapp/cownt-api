import { Request, Response } from 'express';
import { Router } from 'express';
import { NODE_ENV } from '../../../lib/constants/env';
import { seedCowsDynamic } from '../../../scripts/seedAdvancedCows';
import { seedSheepsDynamic } from '../../../scripts/seedAdvancedSheeps';
import { deleteAllCows } from '../../../scripts/deleteAllCows';
import { deleteAllSheeps } from '../../../scripts/deleteAllSheeps';

const router = Router();

router.post('/seed-cows', async (req: Request, res: Response) => {
  if (NODE_ENV !== 'development') {
    res.status(403).json({ message: 'Forbidden outside development' });
    return;
  }
  try {
    await seedCowsDynamic();
    res.status(200).json({ message: 'Cows seeded successfully' });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Error seeding cows', error: String(err) });
    return;
  }
});

router.post('/seed-sheeps', async (req: Request, res: Response) => {
  if (NODE_ENV !== 'development') {
    res.status(403).json({ message: 'Forbidden outside development' });
    return;
  }
  try {
    await seedSheepsDynamic();
    res.status(200).json({ message: 'Sheeps seeded successfully' });
    return;
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error seeding sheeps', error: String(err) });
    return;
  }
});

router.delete('/delete-cows', async (req: Request, res: Response) => {
  if (NODE_ENV !== 'development') {
    res.status(403).json({ message: 'Forbidden outside development' });
    return;
  }
  try {
    await deleteAllCows();
    res.status(200).json({ message: 'Cows deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting cows', error: String(err) });
    return;
  }
});

router.delete('/delete-sheeps', async (req: Request, res: Response) => {
  if (NODE_ENV !== 'development') {
    res.status(403).json({ message: 'Forbidden outside development' });
    return;
  }
  try {
    await deleteAllSheeps();
    res.status(200).json({ message: 'Sheeps deleted successfully' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting sheeps', error: String(err) });
    return;
  }
});

export default router;
