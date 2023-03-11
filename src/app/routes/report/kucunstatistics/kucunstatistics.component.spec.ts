import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KucunstatisticsComponent } from './kucunstatistics.component';

describe('KucunstatisticsComponent', () => {
  let component: KucunstatisticsComponent;
  let fixture: ComponentFixture<KucunstatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucunstatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucunstatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
