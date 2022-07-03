import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarfeebaoxiaodetComponent } from './carfeebaoxiaodet.component';

describe('CarfeebaoxiaodetComponent', () => {
  let component: CarfeebaoxiaodetComponent;
  let fixture: ComponentFixture<CarfeebaoxiaodetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarfeebaoxiaodetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarfeebaoxiaodetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
