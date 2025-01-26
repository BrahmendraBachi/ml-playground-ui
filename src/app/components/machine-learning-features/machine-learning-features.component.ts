import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MACHINE_LEARNING } from 'src/app/helpers/constants';
import { HeaderTitleService } from 'src/app/services/header-title.service';

@Component({
    selector: 'app-machine-learning-features',
    templateUrl: './machine-learning-features.component.html',
    styleUrls: ['./machine-learning-features.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MachineLearningFeaturesComponent {

    constructor(private headerTitleService: HeaderTitleService) {
        this.headerTitleService.updateHeaderTitle(MACHINE_LEARNING);
    }
}
