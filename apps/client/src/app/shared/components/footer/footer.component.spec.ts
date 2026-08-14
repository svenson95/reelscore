import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { LOADING_SERVICE_PROVIDER } from '../../services';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [LOADING_SERVICE_PROVIDER],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
  });

  it(`should display 'reelscore' logo`, () => {
    const logo = fixture.nativeElement.querySelector('rs-logo');

    expect(logo).toBeTruthy();
  });
});
