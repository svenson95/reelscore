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

export function createMongooseModel<T>(
  key: string,
  definition: mongoose.SchemaDefinition<mongoose.SchemaDefinitionType<T>>,
  options: { timestamps?: boolean } = { timestamps: true }
): mongoose.Model<T> {
  const mongooseSchema = new mongoose.Schema<T>(definition, options);

  return mongoose.model<T>(key, mongooseSchema);
}
