import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KaishiComponent } from './kaishi.component';

describe('KaishiComponent', () => {
  let component: KaishiComponent;
  let fixture: ComponentFixture<KaishiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaishiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KaishiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
