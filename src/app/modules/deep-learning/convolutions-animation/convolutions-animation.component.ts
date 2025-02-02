import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import * as tf from "@tensorflow/tfjs"

@Component({
    selector: 'app-convolutions-animation',
    templateUrl: './convolutions-animation.component.html',
    styleUrls: ['./convolutions-animation.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConvolutionsAnimationComponent {

    @Input() imageUrl: string | ArrayBuffer = "assets/nine.jpg";


    @Input() selectedFilterValue: string = "";

    @Input() imageTensor: number[] = [];

    public image: HTMLImageElement;

    public numbers: number[] = Array.from({ length: 30*30 }, (_, i) => i + 1);


    constructor(private cdr: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this._loadImage();
    }

    public async _loadImage(): Promise<void> {
        this.image = await this.loadImageFromUrl(this.imageUrl as string);
        // this.displayImage()
        const imageTensor = tf.browser.fromPixels(this.image);
        const resizedImage = await this.resizeImage(this.image, 30, 30);
        
        console.log("resizedImage.shape: ", resizedImage.shape);

        console.log(await resizedImage.data());
        
        let graySclaed = await this.convertIntoGrayScale(resizedImage);

        console.log(await graySclaed.data());

        // graySclaed.
        
        // console.log("graySclaed: ", await graySclaed.data());

        await this.renderResizedImage(graySclaed);

        (await graySclaed.data()).forEach((data) => {
            // console.log(data);
            this.imageTensor.push(data);
        })

        console.log(this.imageTensor);
        this.cdr.detectChanges();
    }

    async loadImageFromUrl(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    public returnDecimal(num: number): number {
        console.log(num);
        return parseFloat(num.toFixed(1));
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

    private displayImage(): void {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext("2d");

        if (ctx) {
            canvas.width = this.image.width;
            canvas.height = this.image.height;

            ctx.drawImage(this.image, 0, 0);

            document.body.appendChild(canvas);
        }
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

    async resizeImage(imageElement: HTMLImageElement | HTMLCanvasElement, x_dim=300, y_dim=300): Promise<tf.Tensor3D> {
        // Load image as a tensor
        const img = tf.browser.fromPixels(imageElement);
    
        // Resize to 300x300 pixels
        let resizedImg = tf.image.resizeBilinear(img, [x_dim, y_dim]);

        resizedImg = resizedImg.div(255);
    
        return resizedImg;
    }

    async renderResizedImage(resizedTensor: tf.Tensor3D | tf.Tensor2D): Promise<void>  {
        const canvas = document.createElement("canvas");
        // document.body.appendChild(canvas);
        // canvas.width = 300;
        // canvas.height = 300;
        await tf.browser.toPixels(resizedTensor, canvas);
        this.imageUrl = canvas.toDataURL();
        // console.log(resizedTensor);
        this.cdr.detectChanges();
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

    async convertIntoGrayScale(imageTensor: tf.Tensor<tf.Rank>): Promise<tf.Tensor2D> {
        const grayscale = imageTensor.mean(2);  // Mean along the 3rd dimension (RGB channels)
        const grayscaleArray: number[][] = grayscale.arraySync() as number[][];
        const grayscaleRounded = grayscaleArray.map((row: number[]) => 
        row.map((value: number) => parseFloat(value.toFixed(1))));
        console.log(grayscaleRounded);
        return tf.tensor(grayscaleRounded) as tf.Tensor2D;
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