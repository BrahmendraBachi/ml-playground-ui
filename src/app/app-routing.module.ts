import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MachineLearningFeaturesComponent } from './components/machine-learning-features/machine-learning-features.component';
import { ConstructionInProgressComponent } from './commons/construction-in-progress/construction-in-progress.component';
import { DeepLearningFeaturesComponent } from './components/deep-learning-features/deep-learning-features.component';
import { ConvolutionsComponent } from './modules/deep-learning/convolutions/convolutions.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomePageComponent,
        pathMatch: 'full',
    },
    {
        path: 'machine-learning',
        component: MachineLearningFeaturesComponent
    },
    {
        path: 'deep-learning',
        component: DeepLearningFeaturesComponent,
        children: [
            {
                path: "convolutions",
                component: ConvolutionsComponent
            }
        ]
    },
    {
        path: "convolutions",
        component: ConvolutionsComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
