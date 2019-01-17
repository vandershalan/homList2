import {NgModule} from '@angular/core';
import {CategoriesListPage} from "./categoriesList";
import {PipesModule} from "../../../pipes/pipes.module";
import {IonicPageModule} from "ionic-angular";


@NgModule({
    declarations: [
        CategoriesListPage
    ],
    imports: [
        PipesModule,
        IonicPageModule.forChild(CategoriesListPage)
    ],
    exports: [
        CategoriesListPage
    ],
})


export class CategoriesListModule {
}