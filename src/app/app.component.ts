import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    title = 'ml-playground-ui';

    constructor(private cdr: ChangeDetectorRef) {}
}
