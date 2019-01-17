import {NgModule} from '@angular/core';
import {NewCategoryPage} from "./newCategory";
import {IonicPageModule} from "ionic-angular";


@NgModule({
    declarations: [
        NewCategoryPage
    ],
    imports: [
        IonicPageModule.forChild(NewCategoryPage)
    ],
    exports: [
        NewCategoryPage
    ]
})


export class NewCategoryModule {
}