import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaojiaComponent } from './baojia.component';

describe('BaojiaComponent', () => {
  let component: BaojiaComponent;
  let fixture: ComponentFixture<BaojiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaojiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaojiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
