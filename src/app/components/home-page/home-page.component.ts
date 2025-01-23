import { Component } from '@angular/core';
import { ImageCard } from 'src/app/models/image-card.model';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.less'],
})
export class HomePageComponent {


    public features: ImageCard[] = [
        {
            headerTitle: "Machine Learning",
            imageUrl: "assets/dropnet.gif",
            routePart: "machine-learning"
        },
        {
            headerTitle: "Deep Learning",
            imageUrl: "assets/dropnet.gif",
            routePart: "deep-learning"
        }
    ];
}
