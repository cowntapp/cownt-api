import mongoose from 'mongoose';
import { seedSheepsDynamic } from './seedAdvancedSheeps';
import connectDB from '../config/db';

const runSeedSheeps = async () => {
  await connectDB();
  seedSheepsDynamic()
    .then(() => {
      console.log('Script de seed de ovejas completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en el script de seed de ovejas:', error);
      process.exit(1);
    })
    .finally(async () => {
      await mongoose.disconnect();
      console.log('Successfully disconnected from db');
    });
};

runSeedSheeps();
