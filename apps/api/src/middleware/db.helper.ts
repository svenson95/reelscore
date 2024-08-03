import mongoose from 'mongoose';

export class DBHelper {
  static init(): void {
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
        // callback();
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
}

export const getSeason = (date: string): number => {
  const today = new Date();
  const year = today.getFullYear();
  const seasonEnd = new Date(year, 5, 30);
  return seasonEnd.getTime() > new Date(date).getTime() ? year - 1 : year;
};
