import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CangkuComponent } from './cangku.component';

describe('CangkuComponent', () => {
  let component: CangkuComponent;
  let fixture: ComponentFixture<CangkuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CangkuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CangkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
