import { ActivatedRoute, Router } from '@angular/router';
import { Component, DestroyRef, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LEAGUES_METADATA } from '../../constants';
import { LeagueSelectData } from '../../models';
import { LeagueService } from '../../services';

@Component({
  selector: 'futbet-league',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>league works! {{ selectedLeague()?.label }}</p> `,
})
export class LeagueComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly leagueService = inject(LeagueService);
  private readonly destroy = inject(DestroyRef);

  readonly selectedLeague = this.leagueService.selectedLeague;

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe(({ id }) =>
        this.leagueService.selectedLeague.set(this.getLeagueById(id))
      );
  }

  getLeagueById(id: string): LeagueSelectData | undefined {
    const league = LEAGUES_METADATA.find(l => l.id === id);
    return league ? league : undefined;
  }
}
