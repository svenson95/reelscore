export type StateHandler<T> = StateMetadata & T;

type StateMetadata = {
  isLoading: boolean;
  error: string | null;
};
