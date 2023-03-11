import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KucundetimportComponent } from './kucundetimport.component';

describe('KucundetimportComponent', () => {
  let component: KucundetimportComponent;
  let fixture: ComponentFixture<KucundetimportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucundetimportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucundetimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
