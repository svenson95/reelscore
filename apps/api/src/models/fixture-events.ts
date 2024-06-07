import { FixtureEventsDTO } from '@lib/models';
import mongoose from 'mongoose';

const FixtureEventsSchema = new mongoose.Schema<FixtureEventsDTO>({
  parameters: {
    fixture: String,
  },
  response: [],
});

export const FixtureEvents = mongoose.model(
  'fixture-events',
  FixtureEventsSchema
);
