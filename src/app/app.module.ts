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
import { MachineLearningFeaturesComponent } from './components/machine-learning-features/machine-learning-features.component';
import { ConstructionInProgressComponent } from './commons/construction-in-progress/construction-in-progress.component';
import { FooterComponent } from "./components/footer/footer.component";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomePageComponent,
        FeatureCardComponent,
        FeaturesListComponent,
        MachineLearningFeaturesComponent,
        ConstructionInProgressComponent,
    ],
    imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    FooterComponent
],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
