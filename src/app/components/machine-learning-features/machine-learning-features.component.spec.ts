import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineLearningFeaturesComponent } from './machine-learning-features.component';

describe('MachineLearningFeaturesComponent', () => {
  let component: MachineLearningFeaturesComponent;
  let fixture: ComponentFixture<MachineLearningFeaturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MachineLearningFeaturesComponent]
    });
    fixture = TestBed.createComponent(MachineLearningFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
