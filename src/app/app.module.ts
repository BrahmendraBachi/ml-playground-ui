import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FeatureCardComponent } from './commons/feature-card/feature-card.component';
import { FeaturesListComponent } from './components/features-list/features-list.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomePageComponent,
        FeatureCardComponent,
        FeaturesListComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatCardModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
