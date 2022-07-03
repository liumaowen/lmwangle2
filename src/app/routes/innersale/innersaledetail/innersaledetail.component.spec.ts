import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnersaledetailComponent } from './innersaledetail.component';

describe('InnersaledetailComponent', () => {
  let component: InnersaledetailComponent;
  let fixture: ComponentFixture<InnersaledetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnersaledetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnersaledetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
