import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TihuodetComponent } from './tihuodet.component';

describe('TihuodetComponent', () => {
  let component: TihuodetComponent;
  let fixture: ComponentFixture<TihuodetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TihuodetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TihuodetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
