import {NgModule} from '@angular/core';
import {IonicPageModule} from "ionic-angular";
import {EditItemPage} from "./editItem";


@NgModule({
    declarations: [
        EditItemPage
    ],
    imports: [
        IonicPageModule.forChild(EditItemPage)
    ],
    exports: [
        EditItemPage
    ]
})


export class EditItemModule {
}