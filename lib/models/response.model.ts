export type OperationStatus = string;
export type OperationError = unknown;
export type OperationResponse<T> = {
  status: OperationStatus;
  time: Date;
  documents: Array<T>;
  errors: OperationError;
};
