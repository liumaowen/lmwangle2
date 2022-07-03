import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifylistComponent } from './verifylist.component';

describe('VerifylistComponent', () => {
  let component: VerifylistComponent;
  let fixture: ComponentFixture<VerifylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
