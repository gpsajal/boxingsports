import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareddialogComponent } from './shareddialog.component';

describe('ShareddialogComponent', () => {
  let component: ShareddialogComponent;
  let fixture: ComponentFixture<ShareddialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareddialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
