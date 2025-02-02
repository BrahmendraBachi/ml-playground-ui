import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ImageCard } from 'src/app/models/ml.model';

@Component({
    selector: 'app-features-list',
    templateUrl: './features-list.component.html',
    styleUrls: ['./features-list.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturesListComponent {
    
    @Input() public featureLists: ImageCard[];
}
