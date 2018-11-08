import {NgModule} from '@angular/core';
import {SearchPipe} from './search/search';
import {FilterUnusedCategoriesPipe} from "./search/filterUnusedCategories";

@NgModule({
    declarations: [SearchPipe, FilterUnusedCategoriesPipe],
    imports: [],
    exports: [SearchPipe, FilterUnusedCategoriesPipe]
})
export class PipesModule {
}
