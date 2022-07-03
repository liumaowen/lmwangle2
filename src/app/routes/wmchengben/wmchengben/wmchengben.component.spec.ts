import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WmchengbenComponent } from './wmchengben.component';

describe('WmchengbenComponent', () => {
  let component: WmchengbenComponent;
  let fixture: ComponentFixture<WmchengbenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmchengbenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WmchengbenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
