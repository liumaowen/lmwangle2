import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductzhijianComponent } from './productzhijian.component';

describe('ProductzhijianComponent', () => {
  let component: ProductzhijianComponent;
  let fixture: ComponentFixture<ProductzhijianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductzhijianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductzhijianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
