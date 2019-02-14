import {NgModule} from '@angular/core';
import {ItemsListOptionsComponent} from "./itemsListOptions";
import {IonicPageModule} from "ionic-angular";


@NgModule({
    declarations: [
        ItemsListOptionsComponent
    ],
    imports: [
        IonicPageModule.forChild(ItemsListOptionsComponent)
    ],
    entryComponents: [
        ItemsListOptionsComponent
    ],
    exports: [
        ItemsListOptionsComponent
    ]

})


export class ItemsListOptionsModule {
}