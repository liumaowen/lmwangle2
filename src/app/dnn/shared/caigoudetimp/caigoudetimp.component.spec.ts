import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaigoudetimpComponent } from './caigoudetimp.component';

describe('CaigoudetimpComponent', () => {
  let component: CaigoudetimpComponent;
  let fixture: ComponentFixture<CaigoudetimpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaigoudetimpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaigoudetimpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
