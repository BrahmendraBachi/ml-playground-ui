import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvolutionsGraphicsComponent } from './convolutions-graphics.component';

describe('ConvolutionsGraphicsComponent', () => {
  let component: ConvolutionsGraphicsComponent;
  let fixture: ComponentFixture<ConvolutionsGraphicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConvolutionsGraphicsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConvolutionsGraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
