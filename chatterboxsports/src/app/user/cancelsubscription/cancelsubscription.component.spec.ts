import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelsubscriptionComponent } from './cancelsubscription.component';

describe('CancelsubscriptionComponent', () => {
  let component: CancelsubscriptionComponent;
  let fixture: ComponentFixture<CancelsubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelsubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelsubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
