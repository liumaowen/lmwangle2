import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JingliaohesuanComponent } from './jingliaohesuan.component';


describe('JingliaohesuanComponent', () => {
  let component: JingliaohesuanComponent;
  let fixture: ComponentFixture<JingliaohesuanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JingliaohesuanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JingliaohesuanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
