import { Pipe, PipeTransform } from '@angular/core';
import {Item} from "../../model/item";
import {SortService} from "../../utils/SortService";


@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {

    transform(items: Item[], sortOptions: any): Item[] {

        if(!items) return [];

        if(!sortOptions) return items;

        return items.sort(SortService.sortBy(sortOptions));
    }
}
