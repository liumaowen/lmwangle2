import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrginterestComponent } from './orginterest.component';

describe('OrginterestComponent', () => {
  let component: OrginterestComponent;
  let fixture: ComponentFixture<OrginterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrginterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrginterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
