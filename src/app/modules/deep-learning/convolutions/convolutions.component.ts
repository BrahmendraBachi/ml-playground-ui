import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-convolutions',
    templateUrl: './convolutions.component.html',
    styleUrls: ['./convolutions.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConvolutionsComponent {

    constructor(private cdr: ChangeDetectorRef) {

    }

    public imageUrl: string | ArrayBuffer | null = null;

    public filterTypes: { viewValue: string, value: string }[] = [
        {
            viewValue: "3 * 3",
            value: "3 * 3"
        },
        {
            viewValue: "5 * 5",
            value: "5 * 5"
        }
    ]

    public onFileChanged(event: File): void {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imageUrl = e.target?.result;
            this.cdr.detectChanges();
        };
        reader.readAsDataURL(event);
    }
}
