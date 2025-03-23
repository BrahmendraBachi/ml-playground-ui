import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as tf from "@tensorflow/tfjs"
import { BehaviorSubject, delay, filter, Observable, of, race, range, Subject, switchMap, takeUntil, timer } from 'rxjs';
import { RxUnsubscribe } from 'src/app/helpers/directives/rx-unsubscribe.directive';
import { Filter } from 'src/app/models/ml.model';

export const PIXELS = 30;

@Component({
    selector: 'app-convolutions-animation',
    templateUrl: './convolutions-animation.component.html',
    styleUrls: ['./convolutions-animation.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConvolutionsAnimationComponent extends RxUnsubscribe implements OnInit {

    @Input() imageUrl: string | ArrayBuffer = "assets/nine.jpg";
    @Input() selectedFilterValue: string = "";

    private imageTensor: tf.Tensor2D;
    public imageFlattenedTensor: number[] = [];
    public filterAppliedImageFlattenedTensor: any[] = Array.from({length: PIXELS * PIXELS}, (_, i) => '');
    public animatorGrid: number[];
    public defaultFilter: number[];
    private allFilters: Record<string, number[]> = {
        "vertical": [1, 1, 1, 0, 0, 0, -1, -1, -1],
        "horizontal": [-1, 0, 1, -1, 0, 1, -1, 0, 1]

    }

    private images: {imageName: string, imageUrl: string}[] = [
        {
            imageName: "three",
            imageUrl: "assets/three.jpg"
        },
        {
            imageName: "nine",
            imageUrl: "assets/nine.jpg"
        }
    ]
    public filterTypes: { viewValue: string, value: string, noOfCells: number }[] = [
        {
            viewValue: "3 * 3",
            value: "3 * 3",
            noOfCells: 9
        }
    ]
    private _animationElement: any;

    @ViewChild("animation", {static: false})
    set animationElement(element: ElementRef | undefined) {
        if (!!element && !this._animationElement) {
            this._animationElement = element.nativeElement;
        }
    } 

    private beforeApplyFilter = new BehaviorSubject<number>(0);
    public beforeApplyFilterObservable$ = this.beforeApplyFilter.asObservable();
    private afterFilterApply = new BehaviorSubject<number>(null);
    public afterApplyFilterObservable$ = this.afterFilterApply.asObservable();
    private completeAnimation: Subject<void> = new Subject();
    private completeAnimation$ = this.completeAnimation.asObservable();
    public animateTimer: number = 2000;
    public amplifyRate: number = 2;

    public isStartedAnimation: boolean = false;
    public image: HTMLImageElement
    public filter: Filter = {
        filterType: "3 * 3",
        noOfCells: 9
    }
    public image_dimensions: {x_pixels: number, y_pixels: number} = {
        x_pixels: PIXELS,
        y_pixels: PIXELS
    }

    constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2) {
        super();
    }

    public ngOnInit(): void {
        this.imageUrl = this.images[1].imageUrl;
        this._loadImage();
        this.defaultFilter = this.allFilters["horizontal"];
        this.animation();
        this.selectedFilterValue = this.filter.filterType;
        this.addGridStyleToHTML();
        this.cdr.detectChanges();
    }


    public startAnimation(): void {
        this.isStartedAnimation = true;
        this.cdr.detectChanges();
        this.beforeApplyFilter.next(1);
    }

    public animation(): void {
        this.beforeApplyFilterObservable$.pipe(
            filter(value => !!value),
            takeUntil(race(this.completeAnimation$, this.destroy$))
        ).subscribe((iterator_id: number) => {
            const initial_boundaries = this.getElementsCoordinatesById(String("bf_" + iterator_id));
            const filter_boundaries = this.getElementsCoordinatesById("filter");
            this.cdr.detectChanges();
            this.moveAnimatorToFilter(initial_boundaries, filter_boundaries, iterator_id);
        });

        this.afterApplyFilterObservable$.pipe(
            filter(value => !!value),
            takeUntil(race(this.completeAnimation$, this.destroy$))
        ).subscribe((iterator_id: number) => {
            this.completeAnimatorGridWithValues(iterator_id);
            const target_boundaries = this.getElementsCoordinatesById(String("af_" + iterator_id));
            this.moveFilteredAnimator(target_boundaries, iterator_id);
        });
    }

    private roundTransitionTime(): number {
        return parseFloat((this.animateTimer / 1000).toFixed(1));
    }

    public moveAnimatorToFilter(initial_boundaries: DOMRect, filter_boundaries: DOMRect, iterator: number): void {
        this._animationElement.style.transitionDuration = '0s';
        this._animationElement.style.top = `${initial_boundaries.top}px`;
        this._animationElement.style.left = `${initial_boundaries.left}px`;
        this._animationElement.style.height = '60px';
        this._animationElement.style.width = '60px';
        this._animationElement.style.padding = "0"
        this._animationElement.style.gridTemplateColumns = "repeat(3, 20px)";
        this._animationElement.style.gridTemplateRows = "repeat(3, 20px)";
        this._animationElement.style.opacity = "1"
        this.cdr.detectChanges();

        // console.log(`assigned initial boundaries for ${iterator}`);

        timer(1).pipe(
            switchMap(() => {
                this._animationElement.style.transitionProperty = 'all';
                this._animationElement.style.transitionDuration = `${this.roundTransitionTime()}s`;
                this._animationElement.style.transitionTimingFunction = 'ease';
                this.cdr.detectChanges();
                return of({})
            }), 
            takeUntil(race(this.destroy$, this.completeAnimation$))).subscribe((data) => {
                this._animationElement.style.height = `${filter_boundaries.height}px`;
                this._animationElement.style.width = `${filter_boundaries.width}px`;
                this._animationElement.style.top = `${filter_boundaries.top}px`;
                this._animationElement.style.left = `${filter_boundaries.left}px`;
                this._animationElement.style.gridTemplateColumns = "repeat(3, 100px)";
                this._animationElement.style.gridTemplateRows = "repeat(3, 100px)";
                this._animationElement.style.opacity = "0.6"
                this._animationElement.style.padding = "5px";
                this.cdr.detectChanges();
                timer(this.animateTimer).subscribe(() => {
                    this.afterFilterApply.next(iterator);
                })
            })
    }

    private moveFilteredAnimator(target_boundaries: DOMRect, iterator_id: number): void {
        this.animatorGrid = Array.from({length: 9}, (_, i) => i).map((ind) => this.animatorGrid[ind] * this.defaultFilter[ind]);
        this._animationElement.style.opacity = "1"
        this.cdr.detectChanges();

        timer(1).pipe(
            switchMap(() => {
                this._animationElement.style.transition = `${this.roundTransitionTime()}`;
                this._animationElement.style.top = `${target_boundaries.top}px`;
                this._animationElement.style.left = `${target_boundaries.left}px`;
                this._animationElement.style.height = '20px';
                this._animationElement.style.width = '20px';
                this._animationElement.style.padding = "0";
                this._animationElement.style.gridTemplateColumns = `repeat(3, ${Math.floor(20 / 3)}px)`;
                this._animationElement.style.gridTemplateRows = `repeat(3, ${Math.floor(20 / 3)}px)`;
                this._animationElement.style.opacity = "0.1";
                this.cdr.detectChanges();
                return of({});
            }),
            takeUntil(race(this.completeAnimation$, this.destroy$))
        ).subscribe(() => {
            timer(this.animateTimer).subscribe(() => {
                iterator_id += (iterator_id + 2) % PIXELS === 0 ? 3 : 1
                if (iterator_id >= 840) {
                    this.completeAnimation.next();
                    this.isStartedAnimation = false;
                };
                const avgOfAnimatorGrid = Math.min((this.animatorGrid.reduce((sum, num) => sum + num, 0) / 9) * this.amplifyRate, 1);
                this.filterAppliedImageFlattenedTensor[iterator_id] = this.returnDecimal(avgOfAnimatorGrid < 0 ? 0 : avgOfAnimatorGrid);
                this.cdr.detectChanges();
                this.beforeApplyFilter.next(iterator_id);
            })
        })
    }

    private completeAnimatorGridWithValues(iterator: number): void {
        const x = Math.floor(iterator / PIXELS);
        const y = (iterator - 1) % PIXELS;
        this.animatorGrid = this.imageTensor.slice([x, y], [3, 3]).flatten().arraySync();
        this.animatorGrid = this.animatorGrid.map((val) => this.returnDecimal(val));
    }
    
    public async _loadImage(): Promise<void> {
        this.image = await this.loadImageFromUrl(this.imageUrl as string);
        // this.displayImage()
        const resizedImage = await this.resizeImage(this.image);
        this.imageTensor =await this.convertIntoGrayScale(resizedImage);
        // await this.renderResizedImage(graySclaed)
        this.imageFlattenedTensor = this.imageTensor.flatten().arraySync();
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

    async resizeImage(imageElement: HTMLImageElement | HTMLCanvasElement, x_dim=this.image_dimensions.x_pixels, y_dim=this.image_dimensions.y_pixels): Promise<tf.Tensor3D> {
        // Load image as a tensor
        const img = tf.browser.fromPixels(imageElement);
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

    private addGridStyleToHTML(): void {
        const style = this.renderer.createElement('style');
        style.innerHTML = `
        .grid-container {
            display: grid;
            grid-template-columns: repeat(${PIXELS}, 20px);
            grid-template-rows: repeat(${PIXELS}, 20px);
        }
        `;
        this.renderer.appendChild(document.head, style);
    }
}