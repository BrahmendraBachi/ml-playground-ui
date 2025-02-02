import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEEP_LEARNING, MACHINE_LEARNING, ML_PLAYGROUND_UI } from 'src/app/helpers/constants';
import { ImageCard } from 'src/app/models/ml.model';
import { HeaderTitleService } from 'src/app/services/header-title.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {


    public features: ImageCard[] = [
        {
            headerTitle: MACHINE_LEARNING,
            imageUrl: "assets/dropnet.gif",
            routePart: "machine-learning"
        },
        {
            headerTitle: DEEP_LEARNING,
            imageUrl: "assets/dropnet.gif",
            routePart: "deep-learning"
        }
    ];


    constructor(private headerTitleService: HeaderTitleService) {
        this.headerTitleService.updateHeaderTitle(ML_PLAYGROUND_UI);
    }
}
