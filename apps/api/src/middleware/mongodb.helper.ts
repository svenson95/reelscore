import mongoose from 'mongoose';

export const findDocument = async <T>(
  Model: mongoose.Model<T>,
  where,
  equals
) => {
  try {
    const doc = await Model.findOne({ [where]: equals }).lean();
    return doc;
  } catch (error) {
    return 'Find document failed';
  }
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
