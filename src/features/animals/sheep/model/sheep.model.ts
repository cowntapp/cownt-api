import { Document, Schema, Types, model } from 'mongoose';
import { SEX, ORIGIN, ABSENCE } from '../../animalsConsts';

// startReprodDate
// birthAverage

export interface Sheep extends Document {
  // codes
  longCode: string;
  shortCode: string;

  // desc
  breed: Types.ObjectId;
  sex: SEX;
  birthDate: string | null;
  weight: string | null;
  origin: ORIGIN;
  owner: Types.ObjectId;

  // rev
  buyPrice: number | null;
  salePrice: number | null;

  // status
  absence: ABSENCE | null;
  absenceDetail: string | null;

  // tags
  characteristics: Types.ObjectId[];

  // gen
  mother: Types.ObjectId | null;
  children: Types.ObjectId[];
}
export interface SheepWithStatistics extends Sheep {
  birthAverage: number | null;
  lastIntervalDays: number;
}

const sheepSchema = new Schema<Sheep>(
  {
    longCode: { type: String, required: true, unique: true },
    shortCode: { type: String, required: true },
    breed: { type: Schema.ObjectId, ref: 'SheepBreed', required: true },
    sex: { type: String, required: true },
    birthDate: { type: String, default: null },
    weight: { type: String, default: null },
    origin: { type: String, required: true },
    owner: { type: Schema.ObjectId, ref: 'Owner', required: true },
    buyPrice: { type: Number, default: null },
    salePrice: { type: Number, default: null },
    absence: { type: String, default: null },
    absenceDetail: { type: String, default: null },
    characteristics: [{ type: Schema.ObjectId, ref: 'SheepCharacteristic' }],
    mother: { type: Schema.ObjectId, ref: 'Sheep', default: null },
    children: [{ type: Schema.ObjectId, ref: 'Sheep' }],
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);
const SheepModel = model<Sheep>('Sheep', sheepSchema);

export interface SheepBreed extends Document {
  value: string;
}
const sheepBreedSchema = new Schema<SheepBreed>(
  {
    value: { type: String, required: true, unique: true },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);
export const SheepBreedModel = model<SheepBreed>(
  'SheepBreed',
  sheepBreedSchema
);

export interface SheepCharacteristic extends Document {
  value: string;
}
const SheepCharacteristicSchema = new Schema<SheepCharacteristic>(
  {
    value: { type: String, required: true, unique: true },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);
export const SheepCharacteristicModel = model<SheepCharacteristic>(
  'SheepCharacteristic',
  SheepCharacteristicSchema
);

export default SheepModel;
