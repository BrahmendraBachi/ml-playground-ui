import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-construction-in-progress',
	templateUrl: './construction-in-progress.component.html',
	styleUrls: ['./construction-in-progress.component.less'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConstructionInProgressComponent {

	@Input()
	public inProgressText: string = "Design is in Progress";

	@Input()
	public imageUrl: string = "assets/svg-images/construction-in-progress.svg";

}
