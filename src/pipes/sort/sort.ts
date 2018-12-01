import { Pipe, PipeTransform } from '@angular/core';
import {Item} from "../../model/item";
import {SortFnFactory} from "../../utils/SortFnFactory";


@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {

    transform(items: Item[], sortOptions: any[]): Item[] {

        // console.log("SortPipe: sortOptions: " + JSON.stringify(sortOptions));

        if(!items) return [];

        if(!sortOptions) return items;

        return items.sort(SortFnFactory.getSortFn(sortOptions));
    }
}
