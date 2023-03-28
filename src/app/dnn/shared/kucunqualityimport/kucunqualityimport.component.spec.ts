import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KucunqualityimportComponent } from './kucunqualityimport.component';

describe('KucunqualityimportComponent', () => {
  let component: KucunqualityimportComponent;
  let fixture: ComponentFixture<KucunqualityimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucunqualityimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucunqualityimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
