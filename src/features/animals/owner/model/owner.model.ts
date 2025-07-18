import { model, Schema } from 'mongoose';

export interface Owner extends Document {
  value: string;
}
const ownerSchema = new Schema<Owner>(
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
export const OwnerModel = model<Owner>('Owner', ownerSchema);
