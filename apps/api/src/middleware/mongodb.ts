import mongoose from 'mongoose';

export function connectToMongoDB(onConnected: () => void) {
  mongoose.set('strictQuery', false);

  const username = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const cluster = process.env.MONGODB_CLUSTER;
  const database = process.env.MONGODB_DATABASE;

  const params = Object.values({
    allowAutoRetry: 'retryWrites=true',
    writeConcern: 'w=majority',
  }).join('&');

  const uri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${database}?${params}`;
  mongoose.connect(uri);

  mongoose.connection
    .once('connected', () => {
      console.info(
        `[server]: Connected to database '${mongoose.connection.host}'`
      );
      onConnected();
    })
    .once('reconnected', () => {
      console.info(
        `[server]: Reconnected to database '${mongoose.connection.host}'`
      );
    })
    .on('disconnected', () => {
      console.warn(
        `[server]: Disconnected from database '${mongoose.connection.host}'`
      );
    })
    .on('error', (err) => {
      console.warn(`[server]: Connection error: '${err}'`);
    });
}

export const createOrUpdate = async <T extends typeof mongoose.Model<unknown>>(
  model: T,
  body,
  next: (doc) => void
) => {
  const { response, parameters } = body;
  const existing = await model
    .find()
    .where('parameters.fixture')
    .equals(Number(body.parameters.fixture));

  if (existing.length === 0) {
    const doc = await model.create(body);
    return next(doc);
  } else {
    const doc = await model.updateOne(
      { 'parameters.fixture': parameters.fixture },
      response
    );
    return next(doc);
  }
};

export const deleteDocument = async <T extends mongoose.Model<unknown>>(
  model: T,
  req,
  res,
  next
) => {
  const _id = req.query.id;

  try {
    const docs = await model.deleteOne().where('_id').equals(_id);
    return next(docs);
  } catch (error) {
    return res.json({
      response: 'Delete document failed.',
      error,
    });
  }
};
