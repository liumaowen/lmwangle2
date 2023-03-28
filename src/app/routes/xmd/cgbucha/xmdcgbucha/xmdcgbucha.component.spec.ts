import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CgbuchaComponent } from './cgbucha.component';

describe('CgbuchaComponent', () => {
  let component: CgbuchaComponent;
  let fixture: ComponentFixture<CgbuchaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CgbuchaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CgbuchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
