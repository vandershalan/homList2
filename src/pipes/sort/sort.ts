import {Pipe, PipeTransform} from '@angular/core';
import {Item} from "../../model/item";
import {SortFnFactory} from "../../utils/SortFnFactory";
import {Category} from "../../model/category";
import {Observable} from "rxjs";
import {buffer, filter, find, first, map, toArray} from "rxjs/operators";
import {toPromise} from "rxjs-compat/operator/toPromise";


@Pipe({
    name: 'sort',
})
export class SortPipe implements PipeTransform {

    transform(items: Item[], sortOptions: any[], showCategories: boolean, categories: Observable<Category[]>): Item[] {

        if (!items) return [];

        let fullSortOptions : any[] = [];

        if (showCategories) {
            //items.forEach()
            //categories.forEach()
            //let catArr = categories.pipe(map(ct => ct.filter(c => c.name === 'Nabiał')));

           // let itemsWithCategoryOrder = items.map(itm => {categories.pipe(map (cts => {itm.categoryOrder = cts.find(c => c.name === itm.category).order})); return itm;});

            //let aitems = items.map(itm => ({...itm, categoryOrder: categories.pipe(map (cts => cts.find(c => c.name === itm.category)), map(c => c.order))}));

           //let a: any[] = categories.pipe(map ( c => c.map() toArray)));
            //console.log("CAT: ", categories.pipe(map(cts => cts.map(c => console.log(c.name)))));
            // categories.
            //console.log(a);

           //console.log("SortPipe: itemsWithCategoryOrder: " +  JSON.stringify(aitems));

            const categorySort = [{name: 'categoryOrder'}];
            fullSortOptions = categorySort;
        }

        const activeSort = [{name: 'active', reverse: true}];


        fullSortOptions = fullSortOptions.concat(activeSort, sortOptions);

        console.log("SortPipe: fullSortOptions: " + JSON.stringify(fullSortOptions));

        return items.sort(SortFnFactory.getSortFn(fullSortOptions));
    }
}
