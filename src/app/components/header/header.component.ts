import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderTitleService } from 'src/app/services/header-title.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

    public headerTitle$ = this.headerTitleService.headerTitleObservable$;

    constructor(private headerTitleService: HeaderTitleService) {
    }
}
