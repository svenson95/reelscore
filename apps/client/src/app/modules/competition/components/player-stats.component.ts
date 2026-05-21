import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rs-competition-player-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: ` <p class="no-data">Torschützen & Vorlagen Tabellen</p> `,
})
export class PlayerStatsComponent {}
