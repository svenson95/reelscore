import { RapidDTO } from '@lib/models';
import mongoose from 'mongoose';

export const findDocument = async <T extends RapidDTO<unknown>>(
  Model: mongoose.Model<T>,
  where,
  equals
) => {
  const doc = await Model.findOne({ [where]: equals }).lean();
  const response = doc?.response;
  if (response && response.length === 0) return null;
  return doc;
};

// TODO use this util for mongoose models
export const customModel = <T>(
  key: string,
  defintion: mongoose.SchemaDefinition<unknown>
) => {
  const options = { timestamps: true };
  const mongooseSchema = new mongoose.Schema<T>(defintion, options);

  return mongoose.model<T>(key, mongooseSchema);
};
