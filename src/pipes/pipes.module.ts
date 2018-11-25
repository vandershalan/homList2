import {NgModule} from '@angular/core';
import {FilterPipe} from './filter/filter';
import {SortPipe} from "./sort/sort";

@NgModule({
    declarations: [FilterPipe, SortPipe],
    imports: [],
    exports: [FilterPipe, SortPipe]
})
export class PipesModule {
}
