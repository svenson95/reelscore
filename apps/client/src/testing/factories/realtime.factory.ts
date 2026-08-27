import type { OperationResponse, RapidEventsDTO } from '@lib/models';
import { getNow } from '@lib/shared';

export const createOperationResponse = <T>(
  documents: T[]
): OperationResponse<T> => ({
  status: 'success',
  time: getNow().toDate(),
  errors: [],
  documents,
});

export const createRapidEvents = (): RapidEventsDTO => ({
  parameters: {
    fixture: '123',
  },
  errors: [],
  paging: {
    current: 1,
    total: 1,
  },
  response: [],
});
