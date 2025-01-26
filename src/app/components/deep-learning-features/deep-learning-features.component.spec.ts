import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepLearningFeaturesComponent } from './deep-learning-features.component';

describe('DeepLearningFeaturesComponent', () => {
  let component: DeepLearningFeaturesComponent;
  let fixture: ComponentFixture<DeepLearningFeaturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeepLearningFeaturesComponent]
    });
    fixture = TestBed.createComponent(DeepLearningFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
