import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvolutionsComponent } from './convolutions.component';

describe('ConvolutionsComponent', () => {
  let component: ConvolutionsComponent;
  let fixture: ComponentFixture<ConvolutionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConvolutionsComponent]
    });
    fixture = TestBed.createComponent(ConvolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
