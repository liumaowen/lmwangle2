import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerlevelComponent } from './customerlevel.component';

describe('YunfeeComponent', () => {
  let component: CustomerlevelComponent;
  let fixture: ComponentFixture<CustomerlevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerlevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerlevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
