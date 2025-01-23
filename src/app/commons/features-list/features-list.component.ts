import { Component, Input } from '@angular/core';
import { ImageCard } from 'src/app/models/image-card.model';

@Component({
    selector: 'app-features-list',
    templateUrl: './features-list.component.html',
    styleUrls: ['./features-list.component.less'],
})
export class FeaturesListComponent {
    
    @Input() public featureLists: ImageCard[];
}
