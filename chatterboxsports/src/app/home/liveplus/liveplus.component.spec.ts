import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveplusComponent } from './liveplus.component';

describe('LiveplusComponent', () => {
  let component: LiveplusComponent;
  let fixture: ComponentFixture<LiveplusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveplusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveplusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
