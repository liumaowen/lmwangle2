import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QihuodetailimpComponent } from './qihuodetailimp.component';

describe('QihuodetailimpComponent', () => {
  let component: QihuodetailimpComponent;
  let fixture: ComponentFixture<QihuodetailimpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QihuodetailimpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QihuodetailimpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
