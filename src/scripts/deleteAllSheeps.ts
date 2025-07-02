import connectDB from '../config/db';
import mongoose from 'mongoose';
import SheepModel from '../features/animals/sheep/model/sheep.model';

export async function deleteAllSheeps() {
  // await connectDB();
  const result = await SheepModel.deleteMany({});
  console.log(`Deleted ${result.deletedCount} sheeps.`);
  // await mongoose.disconnect();
}
