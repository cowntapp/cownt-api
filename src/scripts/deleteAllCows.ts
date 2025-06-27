import CowModel from '../features/animals/cow/model/cow.model';
import connectDB from '../config/db';
import mongoose from 'mongoose';

export async function deleteAllCows() {
  // await connectDB();
  const result = await CowModel.deleteMany({});
  console.log(`Deleted ${result.deletedCount} cows.`);
  // await mongoose.disconnect();
}
