import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent {
}
