import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ShoukuandetComponent} from './shoukuandet.component';


describe('ShoukuandetComponent', () => {
  let component: ShoukuandetComponent;
  let fixture: ComponentFixture<ShoukuandetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShoukuandetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoukuandetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
