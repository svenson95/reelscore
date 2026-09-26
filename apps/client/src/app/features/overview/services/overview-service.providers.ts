import { DateNavigationService } from './date-navigation.service';
import { FilterService } from './filter.service';
import { OverviewRefreshService } from './overview-refresh.service';
import { SelectedDateService } from './selected-date.service';

export const OVERVIEW_SERVICE_PROVIDERS = [
  DateNavigationService,
  FilterService,
  SelectedDateService,
  OverviewRefreshService,
];
