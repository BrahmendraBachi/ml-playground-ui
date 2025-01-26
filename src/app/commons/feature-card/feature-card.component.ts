import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ImageCard } from 'src/app/models/image-card.model';
import { HeaderTitleService } from 'src/app/services/header-title.service';

@Component({
    selector: 'app-feature-card',
    templateUrl: './feature-card.component.html',
    styleUrls: ['./feature-card.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureCardComponent {

    @Input() 
    public imageCardDetails: ImageCard;

    constructor(
        private router: Router,
        private headerTitleService: HeaderTitleService
    ) {

    }

    public navigateTo(): void {
        this.router.navigateByUrl(this.imageCardDetails.routePart);
        this.headerTitleService.updateHeaderTitle(this.imageCardDetails.headerTitle);
    }
}
