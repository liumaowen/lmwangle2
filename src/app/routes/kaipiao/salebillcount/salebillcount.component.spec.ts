import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalebillcountComponent } from './salebillcount.component';

describe('SalebillcountComponent', () => {
  let component: SalebillcountComponent;
  let fixture: ComponentFixture<SalebillcountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalebillcountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalebillcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
