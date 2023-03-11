import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnersaleComponent } from './innersale.component';

describe('InnersaleComponent', () => {
  let component: InnersaleComponent;
  let fixture: ComponentFixture<InnersaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnersaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnersaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
