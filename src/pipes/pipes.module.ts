import {NgModule} from '@angular/core';
import {FilterPipe} from './filter/filter';
import {SortPipe} from "./sort/sort";
import {ItemFilterPipe} from "./filter/itemFilter";
import {CategoryFilterPipe} from "./filter/categoryFilter";

@NgModule({
    declarations: [FilterPipe, ItemFilterPipe, CategoryFilterPipe, SortPipe],
    imports: [],
    exports: [FilterPipe, ItemFilterPipe, CategoryFilterPipe, SortPipe]
})
export class PipesModule {
}
