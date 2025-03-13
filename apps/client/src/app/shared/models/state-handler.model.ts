export type StateHandler<T> = StateMetadata & T;

type StateMetadata = {
  isLoading: boolean;
  error: string | null;
};

export type WeekStateHandler<T> = StateMetadata & WeekStateMetadata & T;

type WeekStateMetadata = {
  isPreloading: boolean;
};
