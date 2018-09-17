import { Pipe, PipeTransform } from '@angular/core';
import {Item} from "../../model/item";
import {DiacriticsRemoval} from "../../utils/DiacriticsRemoval";


@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
    transform(items: Item[], searchValue: string): Item[] {
        if(!items) return [];
        if(!searchValue) return items;
        searchValue = DiacriticsRemoval.removeDiacritics(searchValue.toLowerCase());
        return items.filter( itm => {
            return DiacriticsRemoval.removeDiacritics(itm.name.toLowerCase()).includes(searchValue);
        });
    }}
