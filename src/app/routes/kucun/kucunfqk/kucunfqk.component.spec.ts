import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KucunfqkComponent } from './kucunfqk.component';

describe('KucundetailComponent', () => {
  let component: KucunfqkComponent;
  let fixture: ComponentFixture<KucunfqkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucunfqkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucunfqkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
