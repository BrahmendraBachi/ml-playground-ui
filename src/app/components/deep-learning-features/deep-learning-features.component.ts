import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEEP_LEARNING } from 'src/app/helpers/constants';
import { HeaderTitleService } from 'src/app/services/header-title.service';

@Component({
    selector: 'app-deep-learning-features',
    templateUrl: './deep-learning-features.component.html',
    styleUrls: ['./deep-learning-features.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeepLearningFeaturesComponent {

    constructor(private headerTitleService: HeaderTitleService) {
        this.headerTitleService.updateHeaderTitle(DEEP_LEARNING);
    }

}
