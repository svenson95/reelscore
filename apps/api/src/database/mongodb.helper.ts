import mongoose from 'mongoose';

import type { FixtureIdParameter, RapidDTO } from '@reelscore-sdk/models';

export async function findDocument<T extends RapidDTO<unknown>>(
  model: mongoose.Model<T>,
  fixtureId: FixtureIdParameter
): Promise<T | null> {
  if (typeof fixtureId !== 'string' && typeof fixtureId !== 'number') {
    return null;
  }

  const filter: mongoose.FilterQuery<T> = {
    'parameters.fixture': fixtureId,
  };
  const sanitizedFilter = mongoose.sanitizeFilter(filter);
  const document = await model.findOne(sanitizedFilter).lean<T>();
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
