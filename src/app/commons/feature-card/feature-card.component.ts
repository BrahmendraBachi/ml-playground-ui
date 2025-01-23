import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ImageCard } from 'src/app/models/image-card.model';

@Component({
    selector: 'app-feature-card',
    templateUrl: './feature-card.component.html',
    styleUrls: ['./feature-card.component.less'],
})
export class FeatureCardComponent {

    @Input() 
    public imageCardDetails: ImageCard;

    constructor(private router: Router) {

    }

    public navigateTo(): void {
        this.router.navigateByUrl(this.imageCardDetails.routePart);
    }
}
