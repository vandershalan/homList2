import {NgModule} from '@angular/core';
import {IonicPageModule} from "ionic-angular";
import {NewItemPage} from "./newItem";


@NgModule({
    declarations: [
        NewItemPage
    ],
    imports: [
        IonicPageModule.forChild(NewItemPage)
    ],
    exports: [
        NewItemPage
    ]
})


export class NewItemModule {
}