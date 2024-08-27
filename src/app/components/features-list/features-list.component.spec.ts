import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesListComponent } from './features-list.component';

describe('FeaturesListComponent', () => {
    let component: FeaturesListComponent;
    let fixture: ComponentFixture<FeaturesListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [FeaturesListComponent],
        });
        fixture = TestBed.createComponent(FeaturesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
