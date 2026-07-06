import mongoose from 'mongoose';

type MongoConfig = {
  username: string;
  password: string;
  cluster: string;
  database: string;
};

type MongoCache = {
  connection: typeof mongoose | null;
  connectionPromise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoCache: MongoCache | undefined;
}

const cache: MongoCache = globalThis.mongoCache ?? {
  connection: null,
  connectionPromise: null,
};

globalThis.mongoCache = cache;

export class DBHelper {
  private static listenersRegistered = false;

  static async init(): Promise<typeof mongoose> {
    this.registerConnectionListeners();

    if (cache.connection && mongoose.connection.readyState === 1) {
      return cache.connection;
    }

    if (!cache.connectionPromise) {
      cache.connectionPromise = this.connect();
    }

    try {
      cache.connection = await cache.connectionPromise;
      return cache.connection;
    } catch (error) {
      cache.connection = null;
      cache.connectionPromise = null;
      throw error;
    }
  }

  private static async connect(): Promise<typeof mongoose> {
    const uri = this.getConnectionUri();

    return mongoose.connect(uri, {
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 20_000,
      maxIdleTimeMS: 30_000,
      bufferCommands: false,
    });
  }

  private static getConnectionUri(): string {
    const { username, password, cluster, database } = this.getConfig();

    const options = {
      retryWrites: true,
      w: 'majority',
    };

    const optionsString = new URLSearchParams(
      Object.entries(options).map(([key, value]) => [key, String(value)])
    ).toString();

    return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(
      password
    )}@${cluster}.mongodb.net/${database}?${optionsString}`;
  }

  private static getConfig(): MongoConfig {
    return {
      username: this.getEnv('MONGODB_USER'),
      password: this.getEnv('MONGODB_PASSWORD'),
      cluster: this.getEnv('MONGODB_CLUSTER'),
      database: this.getEnv('MONGODB_DATABASE'),
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
      .on('error', (error) => {
        console.warn('[server]: Database connection error', error);
      });

    this.listenersRegistered = true;
  }
}
