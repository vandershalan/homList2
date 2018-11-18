import {Item} from "../model/item";
import {DiacriticsRemoval} from "./DiacriticsRemoval";


export class FilterService {
    static filter(item: Item, searchValue: string): boolean {
        if (!searchValue) return true;
        searchValue = DiacriticsRemoval.removeDiacritics(searchValue.toLowerCase());
        return DiacriticsRemoval.removeDiacritics(item.name.toLowerCase()).includes(searchValue);
    }
}
