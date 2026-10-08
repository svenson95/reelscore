import mongoose from 'mongoose';

import type { FixtureIdParameter, RapidDTO } from '@reelscore-sdk/models';

const DEFAULT_MONGOOSE_SCHEMA_OPTIONS: mongoose.SchemaOptions = {
  timestamps: true,
};

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
  options: mongoose.SchemaOptions = DEFAULT_MONGOOSE_SCHEMA_OPTIONS
): mongoose.Model<T> {
  const mongooseSchema = new mongoose.Schema<T>(definition, options);

  return mongoose.model<T>(key, mongooseSchema);
}
