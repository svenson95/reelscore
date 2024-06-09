import { FixtureEventsDTO } from '@lib/models';
import mongoose from 'mongoose';

const EventsSchema = new mongoose.Schema<FixtureEventsDTO>({
  parameters: {
    fixture: String,
  },
  response: [
    {
      time: {
        elapsed: Number,
        extra: Number,
      },
      team: {
        id: Number,
        name: String,
        logo: String,
      },
      player: {
        id: Number,
        name: String,
      },
      assist: {
        id: Number,
        name: String,
      },
      type: {
        type: String,
        enum: ['Goal', 'Card', 'Subst', 'Var'],
      },
      detail: {
        type: String,
        enum: [
          'Normal Goal',
          'Own Goal',
          'Penalty',
          'Missed Penalty',
          'Yellow Card',
          'Red Card',
          'Goal cancelled',
          'Penalty confirmed',
          'Substitution',
          'Substitution [1]',
          'Substitution [2]',
          'Substitution [3]',
          'Substitution [4]',
          'Substitution [5]',
          'Substitution [6]',
          'Substitution [7]',
          'Substitution [8]',
          'Substitution [9]',
          'Substitution [10]',
        ],
      },
      comments: String,
    },
  ],
});

export const FixtureEvents = mongoose.model('fixture-events', EventsSchema);
