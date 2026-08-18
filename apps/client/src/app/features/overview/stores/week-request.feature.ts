import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

import type { StateHandler } from '@app/shared';

type WeekRequestState = StateHandler<{
  isRefreshing: boolean;
}>;

const initialState: WeekRequestState = {
  isLoading: false,
  isRefreshing: false,
  error: null,
};

export const withWeekRequestState = () =>
  signalStoreFeature(
    withState(initialState),
    withComputed(({ isLoading, isRefreshing }) => ({
      isPending: computed(() => isLoading() || isRefreshing()),
    }))
  );

export const getWeekRequestStartPatch = (updateOnly: boolean) => ({
  error: null,
  isLoading: !updateOnly,
  isRefreshing: updateOnly,
});

export const WEEK_REQUEST_END_PATCH = {
  isLoading: false,
  isRefreshing: false,
} as const;
