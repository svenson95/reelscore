import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
  });

  it(`should display 'reelscore' logo`, () => {
    // Arrange
    const nativeElement = fixture.debugElement.nativeElement;

    // Act
    const logo = nativeElement.querySelector('rs-logo');

    // Assert
    expect(logo).toBeTruthy();
  });
});
