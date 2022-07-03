import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsonechengbenComponent } from './wsonechengben.component';

describe('WsonechengbenComponent', () => {
  let component: WsonechengbenComponent;
  let fixture: ComponentFixture<WsonechengbenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsonechengbenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsonechengbenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
