import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvolutionsAnimationComponent } from './convolutions-animation.component';

describe('ConvolutionsGraphicsComponent', () => {
  let component: ConvolutionsAnimationComponent;
  let fixture: ComponentFixture<ConvolutionsAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConvolutionsAnimationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConvolutionsAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
