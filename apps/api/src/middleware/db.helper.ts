import mongoose from 'mongoose';

type MongoConfig = {
  username: string;
  password: string;
  cluster: string;
  database: string;
};

export class DBHelper {
  private static connectionPromise: Promise<typeof mongoose> | null = null;
  private static listenersRegistered = false;

  static init(): Promise<typeof mongoose> {
    return this.connectionPromise ?? this.connect();
  }

  private static connect(): Promise<typeof mongoose> {
    const uri = this.getConnectionUri();

    this.registerConnectionListeners();

    this.connectionPromise = mongoose
      .connect(uri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5_000,
      })
      .catch((error) => {
        this.connectionPromise = null;
        throw error;
      });

    return this.connectionPromise;
  }

  private static getConnectionUri(): string {
    const { username, password, cluster, database } = this.getConfig();
    const options = {
      // Retry eligible write operations after short network errors
      // Useful for short connection interruptions during a write
      retryWrites: true,

      // Confirm a write only after most MongoDB servers have saved it
      w: 'majority',
    };

    const optionsString = new URLSearchParams(
      Object.entries(options).map(([key, value]) => [key, String(value)])
    ).toString();

    return `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${database}?${optionsString}`;
  }

  private static getConfig(): MongoConfig {
    const username = this.getEnv('MONGODB_USER');
    const password = this.getEnv('MONGODB_PASSWORD');
    const cluster = this.getEnv('MONGODB_CLUSTER');
    const database = this.getEnv('MONGODB_DATABASE');

    return {
      username,
      password,
      cluster,
      database,
    };
  }

  private static getEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
      throw new Error(`[server]: Missing environment variable '${name}'`);
    }

    return value;
  }

  private static registerConnectionListeners(): void {
    if (this.listenersRegistered) {
      return;
    }

    mongoose.connection
      .once('connected', () => {
        console.info(
          `[server]: Connected to database '${mongoose.connection.host}'`
        );
      })
      .on('reconnected', () => {
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

    this.listenersRegistered = true;
  }
}
