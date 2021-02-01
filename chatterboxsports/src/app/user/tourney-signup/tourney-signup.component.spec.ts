import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourneySignupComponent } from './tourney-signup.component';

describe('TourneySignupComponent', () => {
  let component: TourneySignupComponent;
  let fixture: ComponentFixture<TourneySignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TourneySignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TourneySignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
