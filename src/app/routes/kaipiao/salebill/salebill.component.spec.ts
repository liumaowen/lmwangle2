import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalebillComponent } from './salebill.component';

describe('SalebillComponent', () => {
  let component: SalebillComponent;
  let fixture: ComponentFixture<SalebillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalebillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalebillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
