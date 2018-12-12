import {NgModule} from '@angular/core';
import {FilterPipe} from './filter/filter';
import {SortPipe} from "./sort/sort";
import {ItemFilterPipe} from "./filter/itemFilter";

@NgModule({
    declarations: [FilterPipe, ItemFilterPipe, SortPipe],
    imports: [],
    exports: [FilterPipe, ItemFilterPipe, SortPipe]
})
export class PipesModule {
}
