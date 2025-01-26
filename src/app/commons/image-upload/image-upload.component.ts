import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadComponent {

    public selectedFile: File | null = null;
    public previewUrl: string | ArrayBuffer | null = null;



    public onFileSelected(event: Event): void {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            this.selectedFile = fileInput.files[0];

            // Generate a preview URL for the selected file
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewUrl = e.target?.result;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    public onSubmit(event: Event): void {
        event.preventDefault();
        // if (!this.selectedFile) return;

        // const formData = new FormData();
        // formData.append('image', this.selectedFile);
        

        // console.log('Image ready to upload:', this.selectedFile);
        console.log("Hello World");
    }

    onDragOver(event: Event) {
        event.preventDefault();
    }
    
    // From drag and drop
    onDropSuccess(event: any) {
        event.preventDefault();
    
        this.onFileChange(event.dataTransfer.files);    // notice the "dataTransfer" used instead of "target"
    }
    
    // From attachment link
    onChange(event: any) {
        this.onFileChange(event.target.files);    // "target" is correct here
    }
    
    private onFileChange(files: File[]) {
        // ...
    }
}
