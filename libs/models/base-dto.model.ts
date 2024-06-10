import { FixtureId } from './fixtures/fixture.model';

export type BaseParameters = { fixture: FixtureId };
export type BasePaging = { current: number; total: number };

export interface BaseDTO<T> {
  parameters: BaseParameters;
  errors: unknown[];
  paging: BasePaging;
  response: T[];
}
