import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntercompanyComponent } from './Intercompany.component';

describe('InnersaledetreportComponent', () => {
  let component: IntercompanyComponent;
  let fixture: ComponentFixture<IntercompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntercompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntercompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
