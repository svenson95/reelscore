import 'dotenv/config';

import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';

const translations = JSON.parse(
  readFileSync(
    new URL(
      '../apps/client/src/app/features/match/components/details/after/components/events/event-translations.json',
      import.meta.url
    ),
    'utf8'
  )
);

const requiredEnvironmentVariables = [
  'MONGODB_USER',
  'MONGODB_PASSWORD',
  'MONGODB_CLUSTER',
  'MONGODB_DATABASE',
];

const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (name) => !process.env[name]
);

if (missingEnvironmentVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvironmentVariables.join(
      ', '
    )}`
  );
}

const username = encodeURIComponent(process.env.MONGODB_USER);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const cluster = process.env.MONGODB_CLUSTER;
const database = process.env.MONGODB_DATABASE;
const connectionString = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${database}?retryWrites=true&w=majority`;

try {
  await mongoose.connect(connectionString, {
    serverSelectionTimeoutMS: 5_000,
    maxPoolSize: 2,
  });

  const [eventValues] = await mongoose.connection
    .collection('fixture-events')
    .aggregate([
      { $unwind: '$response' },
      {
        $group: {
          _id: null,
          types: { $addToSet: '$response.type' },
          details: { $addToSet: '$response.detail' },
          cardComments: {
            $addToSet: {
              $cond: [
                { $eq: ['$response.type', 'Card'] },
                '$response.comments',
                null,
              ],
            },
          },
        },
      },
    ])
    .toArray();

  const missingTranslations = {
    types: findMissingTranslations(
      eventValues?.types ?? [],
      translations.types
    ),
    details: findMissingTranslations(
      eventValues?.details ?? [],
      translations.details
    ),
    cardComments: findMissingTranslations(
      eventValues?.cardComments ?? [],
      translations.cardComments
    ),
  };

  let hasMissingTranslations = false;

  for (const [category, values] of Object.entries(missingTranslations)) {
    console.log(`${category}:`);

    if (values.length === 0) {
      console.log('  All current values have translations.');
      continue;
    }

    hasMissingTranslations = true;
    for (const value of values) {
      console.log(`  - ${value}`);
    }
  }

  process.exitCode = hasMissingTranslations ? 1 : 0;
} finally {
  await mongoose.disconnect();
}

function findMissingTranslations(values, translationMap) {
  return [...new Set(values)]
    .filter((value) => value !== null && value !== '')
    .filter((value) => !Object.hasOwn(translationMap, value))
    .sort((first, second) => first.localeCompare(second));
}
