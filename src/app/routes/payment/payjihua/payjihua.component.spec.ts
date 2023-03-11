import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayjihuaComponent } from './payjihua.component';

describe('PayjihuaComponent', () => {
  let component: PayjihuaComponent;
  let fixture: ComponentFixture<PayjihuaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayjihuaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayjihuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
