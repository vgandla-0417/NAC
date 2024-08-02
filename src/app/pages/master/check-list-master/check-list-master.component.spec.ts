import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckListMasterComponent } from './check-list-master.component';

describe('CheckListMasterComponent', () => {
  let component: CheckListMasterComponent;
  let fixture: ComponentFixture<CheckListMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckListMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckListMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
