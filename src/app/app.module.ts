import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FeatureCardComponent } from './commons/feature-card/feature-card.component';
import { FeaturesListComponent } from './commons/features-list/features-list.component';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MachineLearningFeaturesComponent } from './components/machine-learning-features/machine-learning-features.component';
import { ConstructionInProgressComponent } from './commons/construction-in-progress/construction-in-progress.component';
import { FooterComponent } from "./components/footer/footer.component";
import { DeepLearningFeaturesComponent } from './components/deep-learning-features/deep-learning-features.component';
import { ConvolutionsComponent } from './modules/deep-learning/convolutions/convolutions.component';
import { ImageUploadComponent } from './commons/image-upload/image-upload.component';
import { BreadcrumbsComponent } from './commons/breadcrumbs/breadcrumbs.component';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomePageComponent,
        FeatureCardComponent,
        FeaturesListComponent,
        MachineLearningFeaturesComponent,
        ConstructionInProgressComponent,
        DeepLearningFeaturesComponent,
        ConvolutionsComponent,
        ImageUploadComponent,
        BreadcrumbsComponent,
    ],
    imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
