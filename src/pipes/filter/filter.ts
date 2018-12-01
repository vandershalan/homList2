import { Pipe, PipeTransform } from '@angular/core';
import {Item} from "../../model/item";
import {DiacriticsRemoval} from "../../utils/DiacriticsRemoval";
import {ListOptions} from "../../model/listOptions";


@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {

    transform(items: Item[], searchValue: string, showActive: boolean, showDone: boolean, searchInActive: boolean, searchInDone: boolean): Item[] {

        if(!items) return [];

        if (searchValue) {
            searchValue = this.normalize(searchValue);
            items = items.filter( itm => {
                return (((searchInActive && itm.active) || (searchInDone && !itm.active)) && this.normalize(itm.name).includes(searchValue));
            });
        } else {
            items = items.filter( itm => {
                return (showActive && itm.active) || (showDone && !itm.active);
            });
        }

        return items;
    }


    normalize(str: string): string {
        return str ? DiacriticsRemoval.removeDiacritics(str.toLowerCase()) : str;
    }

}
