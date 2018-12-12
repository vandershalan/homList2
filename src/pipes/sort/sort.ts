import {Pipe, PipeTransform} from '@angular/core';
import {Item} from "../../model/item";
import {SortFnFactory} from "../../utils/SortFnFactory";


@Pipe({
    name: 'sort',
})
export class SortPipe implements PipeTransform {

    transform(items: Item[], sortOptions: any[]): Item[] {

        if (!items) return [];

        console.log("SortPipe: fullSortOptions: " + JSON.stringify(sortOptions));

        return items.sort(SortFnFactory.getSortFn(sortOptions));
    }
}
