import { Pipe, PipeTransform } from '@angular/core';
import {Item} from "../../model/item";
import {DiacriticsRemoval} from "../../utils/DiacriticsRemoval";


@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {

    transform(items: Item[], searchValue: string): Item[] {

        if(!items) return [];

        if(!searchValue) return items;

        searchValue = this.normalize(searchValue.toLowerCase());

        return items.filter( itm => {
            return this.normalize(itm.name).includes(searchValue);
        });

    }


    normalize(str: string): string {
        return DiacriticsRemoval.removeDiacritics(str.toLowerCase());
    }


}
