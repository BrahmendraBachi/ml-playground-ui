import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

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

    public selectedFilterValue: string = "";

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
        this.onImageUpload(event);
        // const reader = new FileReader();
        // reader.onload = (e) => {
        //     this.imageUrl = e.target?.result;
        //     this.getImageData();
        //     this.cdr.detectChanges();
        // };
        // reader.readAsDataURL(event);
    }

    public onFilterChange(event: any): void {
        this.selectedFilterValue = event.target?.value;
        this.cdr.detectChanges();
    }

    public resetFile(): void {
        this.imageUrl = ""
        this.cdr.detectChanges();
    }

    private getImageData(): void {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const image = new Image();

        if (typeof(this.imageUrl) !== "string") {
            return ;
        }

        image.src = this.imageUrl; // Replace with your image URL
    }

    loadImage(file: File): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
          const img = new Image();
          const reader = new FileReader();
    
          reader.onload = () => {
            img.src = reader.result as string;
            this.imageUrl = img.src;
            this.cdr.detectChanges();
          };
    
          img.onload = () => resolve(img);
          img.onerror = reject;
    
          reader.readAsDataURL(file);
        });
    }

    async onImageUpload(file: File) {
        const image = await this.loadImage(file);
    
        // Convert image to tensor
        const imageTensor = tf.browser.fromPixels(image);
    
        // Add batch dimension [batch, height, width, channels]
        const batchedImage: tf.Tensor<tf.Rank.R4> = imageTensor.expandDims(0); // This will make the tensor shape [1, height, width, channels]
    
        // Define a simple filter (e.g., edge detection)
        const filter = tf.tensor4d(
            [
              // Channel 1
              -1, -1, -1,
              -1, 8, -1,
              -1, -1, -1,
          
              // Channel 2 (same for simplicity)
              -1, -1, -1,
              -1, 8, -1,
              -1, -1, -1,
          
              // Channel 3 (same for simplicity)
              -1, -1, -1,
              -1, 8, -1,
              -1, -1, -1
            ],
            [3, 3, 3, 1] // Filter size: [filterHeight, filterWidth, inChannels, outChannels]
          );
          
    
        // Apply convolution
        const convolved = tf.conv2d(batchedImage.toFloat(), filter, [1, 1], 'same'); // Stride [1, 1], padding 'same'
    
        // Print the result tensor
        this.displayConvolvedImage(convolved);
    }

    async displayConvolvedImage(convolved: any) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const imageTensor = convolved.squeeze([0]);

        const normalizedTensor = imageTensor.toFloat().div(tf.scalar(255)); 
      
        if (ctx) {
          // Convert the tensor back to an image and draw it on the canvas
            const normalizedTensor = imageTensor.toFloat().div(tf.scalar(255));  // Normalize if in range [0, 255]

// Clip values to ensure they are in range [0, 1]
        const clippedTensor = normalizedTensor.clipByValue(0, 1);
                
        // Convert the tensor to pixels and draw it on the canvas
        await tf.browser.toPixels(clippedTensor, canvas);


      
          // Now you can use the canvas to display the image
          document.body.appendChild(canvas);
      
          // Optionally, create an image element from the canvas (if you want to use it elsewhere)
          const img = new Image();
          img.src = canvas.toDataURL();
          document.body.appendChild(img); // Add image to body, or use elsewhere
        }
    }
}
