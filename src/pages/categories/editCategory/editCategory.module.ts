import {NgModule} from '@angular/core';
import {EditCategoryPage} from "./editCategory";
import {IonicPageModule} from "ionic-angular";


@NgModule({
    declarations: [
        EditCategoryPage
    ],
    imports: [
        IonicPageModule.forChild(EditCategoryPage)
    ],
    exports: [
        EditCategoryPage
    ]
})


export class EditCategoryModule {
}