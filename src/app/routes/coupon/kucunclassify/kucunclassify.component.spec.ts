import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KucunclassifyComponent } from './kucunclassify.component';

describe('KucunclassifyComponent', () => {
  let component: KucunclassifyComponent;
  let fixture: ComponentFixture<KucunclassifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KucunclassifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KucunclassifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
