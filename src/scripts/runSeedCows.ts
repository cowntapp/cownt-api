import mongoose from 'mongoose';
import { seedCowsDynamic } from './seedAdvancedCows';
import connectDB from '../config/db';

const runSeedCows = async () => {
  await connectDB();

  seedCowsDynamic()
    .then(() => {
      console.log('Script de seed de vacas completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en el script de seed de vacas:', error);
      process.exit(1);
    })
    .finally(async () => {
      await mongoose.disconnect();
      console.log('Successfully disconnected from db');
    });
};
runSeedCows();
