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
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imageUrl = e.target?.result;
            this.getImageData();
            this.cdr.detectChanges();
        };
        reader.readAsDataURL(event);
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

    async resizeImage(imageElement: HTMLImageElement | HTMLCanvasElement): Promise<tf.Tensor3D> {
        // Load image as a tensor
        const img = tf.browser.fromPixels(imageElement);
    
        // Resize to 300x300 pixels
        let resizedImg = tf.image.resizeBilinear(img, [300, 300]);

        resizedImg = resizedImg.div(255);
    
        return resizedImg;
    }

    async renderResizedImage(resizedTensor: tf.Tensor3D): Promise<void>  {
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        canvas.width = 300;
        canvas.height = 300;
        await tf.browser.toPixels(resizedTensor, canvas);
    }

    async onImageUpload(file: File) {
        const image = await this.loadImage(file);
        const resizedTensor = await this.resizeImage(image);
        console.log("resizedTensor.shape: ", resizedTensor.shape);
        console.log(await resizedTensor.data())
        this.renderResizedImage(resizedTensor);

        const grayscaled = await this.convertIntoGrayImage(image);

        // const tensor = tf.browser.fromPixels(grayscaled, 1); // 1 channel (grayscale)
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
        const convolved = tf.conv2d(batchedImage.toFloat(), filter, [1, 1], "same"); // Stride [1, 1], padding 'same'
    
        // Print the result tensor
        // this.displayConvolvedImage(convolved);
    }

    async convertIntoGrayImage(imageElement: any): Promise<any> {
        const img = tf.browser.fromPixels(imageElement);  // Load image as a tensor
        const grayscale = img.mean(2).div(255);  // Convert to grayscale (Removes color channel, making it 2D)

        // Create a canvas
        // const canvas = document.createElement("canvas");
        // document.body.appendChild(canvas);
        // canvas.width = img.shape[1];
        // canvas.height = img.shape[0];


        // // // Convert back to pixels and draw on canvas
        // await tf.browser.toPixels(grayscale as any, canvas);
        return grayscale
    }

    async displayConvolvedImage(convolved: any) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const imageTensor = convolved.squeeze([0]);
      
        if (ctx) {
          // Convert the tensor back to an image and draw it on the canvas
            const normalizedTensor = imageTensor.toFloat().div(tf.scalar(255));
            const clippedTensor = normalizedTensor.clipByValue(0, 1);
                    
            // Convert the tensor to pixels and draw it on the canvas
            await tf.browser.toPixels(clippedTensor, canvas);


        
            // Now you can use the canvas to display the image
            document.body.appendChild(canvas);
        }
    }
}
