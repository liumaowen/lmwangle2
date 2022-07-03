import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpzhiyajinComponent } from './impzhiyajin.component';

describe('ImpzhiyajinComponent', () => {
  let component: ImpzhiyajinComponent;
  let fixture: ComponentFixture<ImpzhiyajinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpzhiyajinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpzhiyajinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
