import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvolutionsGridComponent } from './convolutions-grid.component';

describe('ConvolutionsGridComponent', () => {
  let component: ConvolutionsGridComponent;
  let fixture: ComponentFixture<ConvolutionsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvolutionsGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConvolutionsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
