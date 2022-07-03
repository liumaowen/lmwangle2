import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CangkudetComponent } from './cangkudet.component';

describe('CangkudetComponent', () => {
  let component: CangkudetComponent;
  let fixture: ComponentFixture<CangkudetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CangkudetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CangkudetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
