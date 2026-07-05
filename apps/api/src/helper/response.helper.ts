export type OperationError = string;
export type OperationResponse<T> = {
  documents: Array<T>;
  errors: OperationError;
};
export const operationResponse = <T>(
  documents: Array<T>,
  errors: OperationError = null
): OperationResponse<T> => ({
  documents,
  errors,
});
