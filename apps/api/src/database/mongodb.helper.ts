import mongoose from 'mongoose';

import type { RapidDTO } from '@lib/models';

export async function findDocument<T extends RapidDTO<unknown>>(
  model: mongoose.Model<T>,
  filter: mongoose.FilterQuery<T>
): Promise<T | null> {
  const document = await model.findOne(filter).lean<T>();
  if (!document?.response.length) return null;

  return document;
}

// TODO use this util for mongoose models
export function customModel<T>(
  key: string,
  definition: mongoose.SchemaDefinition<mongoose.SchemaDefinitionType<T>>
): mongoose.Model<T> {
  const mongooseSchema = new mongoose.Schema<T>(definition, {
    timestamps: true,
  });

  return mongoose.model<T>(key, mongooseSchema);
}
