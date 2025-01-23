import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionInProgressComponent } from './construction-in-progress.component';

describe('ConstructionInProgressComponent', () => {
  let component: ConstructionInProgressComponent;
  let fixture: ComponentFixture<ConstructionInProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructionInProgressComponent]
    });
    fixture = TestBed.createComponent(ConstructionInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
