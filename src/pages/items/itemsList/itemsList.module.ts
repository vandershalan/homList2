import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PipesModule} from "../../../pipes/pipes.module";
import {ItemsListPage} from "./itemsList";


@NgModule({
    declarations: [
        ItemsListPage
    ],
    imports: [
        PipesModule,
        IonicPageModule.forChild(ItemsListPage)
    ],
    entryComponents: [
        ItemsListPage
    ],
    exports: [
        ItemsListPage
    ]

})


export class ItemsListModule {
}