import { Pipe, PipeTransform } from '@angular/core';
import {DiacriticsRemoval} from "../../utils/DiacriticsRemoval";
import {ItemWithCategory} from "../../model/itemWithCategory";


@Pipe({
  name: 'itemFilter',
})
export class ItemFilterPipe implements PipeTransform {

    transform(itemsWithCategory: ItemWithCategory[], searchValue: string, showActive: boolean, showDone: boolean, searchInActive: boolean, searchInDone: boolean): ItemWithCategory[] {

        //console.log("FilterPipe");

        if(!itemsWithCategory) return [];

        if (searchValue) {
            searchValue = this.normalize(searchValue);
            itemsWithCategory = itemsWithCategory.filter( itmWC => ((searchInActive && itmWC.item.active) || (searchInDone && !itmWC.item.active)) && this.normalize(itmWC.item.name).includes(searchValue));
        } else {
            itemsWithCategory = itemsWithCategory.filter( itmWC => (showActive && itmWC.item.active) || (showDone && !itmWC.item.active));
        }

        return itemsWithCategory;
    }


    normalize(str: string): string {
        return str ? DiacriticsRemoval.removeDiacritics(str.toLowerCase()) : str;
    }

}
