import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as tf from "@tensorflow/tfjs"
import { BehaviorSubject, filter, Observable, race, range, Subject, takeUntil } from 'rxjs';
import { RxUnsubscribe } from 'src/app/helpers/directives/rx-unsubscribe.directive';
import { Filter } from 'src/app/models/ml.model';

@Component({
    selector: 'app-convolutions-animation',
    templateUrl: './convolutions-animation.component.html',
    styleUrls: ['./convolutions-animation.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConvolutionsAnimationComponent extends RxUnsubscribe implements OnInit {

    @Input() imageUrl: string | ArrayBuffer = "assets/nine.jpg";

    @Input() selectedFilterValue: string = "";

    @Input() imageTensor: number[] = [];

    public filterTypes: { viewValue: string, value: string, noOfCells: number }[] = [
        {
            viewValue: "3 * 3",
            value: "3 * 3",
            noOfCells: 9
        },
        {
            viewValue: "5 * 5",
            value: "5 * 5",
            noOfCells: 25
        }
    ]

    private _animationElement: ElementRef | undefined;


    @ViewChild("animation", {static: false})
    set animationElement(element: ElementRef | undefined) {
        if (!this.animationElement) {
            this._animationElement = element;
        }
    } 


    private beforeApplyFilter = new BehaviorSubject<number>(0);
    public beforeApplyFilterObservable$ = this.beforeApplyFilter.asObservable();

    private afterFilterApply = new BehaviorSubject<number>(null);
    public afterApplyFilterObservable$ = this.afterFilterApply.asObservable();

    private completeAnimation: Subject<void> = new Subject();
    private completeAnimation$ = this.completeAnimation.asObservable();

    public isStartedAnimation: boolean = false;

    public image: HTMLImageElement

    public filter: Filter = {
        filterType: "3 * 3",
        noOfCells: 9
    }

    public image_dimentions: {x_dims: number, y_dims: number} = {
        x_dims: 30,
        y_dims: 30
    }

    constructor(private cdr: ChangeDetectorRef) {
        super();
    }

    public ngOnInit(): void {
        this._loadImage();
        this.animation();
        this.startAnimation();
        this.selectedFilterValue = this.filter.filterType;
        this.cdr.detectChanges();
    }


    public startAnimation(): void {
        
    }

    public animation(): void {
        this.beforeApplyFilterObservable$.pipe(
            filter(value => !!value),
            takeUntil(race(this.completeAnimation$, this.destroy$))
        ).subscribe((iterator_id: number) => {
            const initial_boundaries = this.getElementsCoordinatesById(String(iterator_id));
            const target_boundaries = this.getElementsCoordinatesById("filter");
            this.moveAnimatorToFilter(initial_boundaries, target_boundaries, iterator_id)
        })

        this.afterApplyFilterObservable$.pipe(
            filter(value => !!value),
            takeUntil(race(this.completeAnimation$, this.destroy$))
        ).subscribe((iterator_id: number) => {
            // pass
            if ((iterator_id + 2) % 30 === 0) {
                iterator_id = iterator_id + 2;
            } else if ((iterator_id + 3) % 30 === 0) {
                iterator_id = iterator_id + 3;
            } else {
                iterator_id++;
            }
            if (iterator_id >= 840) {
                this.completeAnimation.next();
            };
            this.beforeApplyFilter.next(iterator_id);
        } )
    }

    public async _loadImage(): Promise<void> {
        this.image = await this.loadImageFromUrl(this.imageUrl as string);
        // this.displayImage()
        const imageTensor = tf.browser.fromPixels(this.image);
        const resizedImage = await this.resizeImage(this.image, 30, 30);
        
        let graySclaed = await this.convertIntoGrayScale(resizedImage);

        await this.renderResizedImage(graySclaed);

        (await graySclaed.data()).forEach((data) => {
            this.imageTensor.push(data);
        })

        this.cdr.detectChanges();

        // this.iterateAnimator();
    }

    // public iterateAnimator(): void {
    //     let iterator = 0;
    //     let interval = setInterval(() => {
    //         const initial_boundaries = this.getElementsCoordinatesById(String(iterator));
    //         const target_boundaries = this.getElementsCoordinatesById("filter");
    //         console.log(target_boundaries);
    //         this.animate(initial_boundaries, target_boundaries);
    //         if ((iterator + 2) % 30 === 0) {
    //             iterator = iterator + 2;
    //         } else if ((iterator + 3) % 30 === 0) {
    //             iterator = iterator + 3;
    //         } else {
    //             iterator++;
    //         } 
    //         if (iterator >= 840) {
    //             clearInterval(interval);
    //         };
    //     }, 2000);
    // }

    public moveAnimatorToFilter(initial_boundaries: DOMRect, target_boundaries: DOMRect, iterator: number): void {
        const animatorElement = this._animationElement.nativeElement;
        animatorElement.style.top = `${initial_boundaries.top}px`;
        animatorElement.style.left = `${initial_boundaries.left}px`;
        this.cdr.detectChanges();

        animatorElement.style.transitionProperty = 'all';
        animatorElement.style.transitionDuration = '2s';
        animatorElement.style.transitionTimingFunction = 'ease';
        this.cdr.detectChanges();

        setTimeout(() => {
            animatorElement.style.height = `${target_boundaries.height}px`;
            animatorElement.style.width = `${target_boundaries.width}px`;
            animatorElement.style.top = `${target_boundaries.top}px`;
            animatorElement.style.left = `${target_boundaries.left}px`;
            animatorElement.style.gridTemplateColumns = "repeat(3, 100px)";
            animatorElement.style.gridTemplateRows = "repeat(3, 100px)";
            animatorElement.style.opacity = "0.4"
            animatorElement.style.padding = "5px"
            this.cdr.detectChanges();
            this.afterFilterApply.next(iterator);
        }, 500);
    }
    
    public moveFilteredAnimatorToOutput(): void {
        
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
        return parseFloat(num.toFixed(1));
    }

    public onFilterChange(event: any): void {
        this.selectedFilterValue = event.target?.value;

        this.filter = [this.filterTypes.find((_filter) => _filter.value === this.selectedFilterValue)].map((_filterValue) => {
            return {
                filterType: _filterValue.value,
                noOfCells: _filterValue.noOfCells
            } as Filter;
        })[0];
        this.cdr.detectChanges();
    }

    public isDecorated(index: number): boolean {
        return index === 0;
    }

    public getElementsCoordinatesById(id: string): DOMRect {
        const element = document.getElementById(id);
        const boundaries = element.getBoundingClientRect();
        return boundaries;
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