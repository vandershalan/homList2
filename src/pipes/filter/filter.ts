import { Pipe, PipeTransform } from '@angular/core';
import {DiacriticsRemoval} from "../../utils/DiacriticsRemoval";


@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {

    transform(strArr: string[], searchValue: string): string[] {

        if(!strArr) return [];

        if (searchValue) {
            searchValue = this.normalize(searchValue);
            strArr = strArr.filter( str => (this.normalize(str).includes(searchValue)));
        }

        return strArr;
    }


    normalize(str: string): string {
        return str ? DiacriticsRemoval.removeDiacritics(str.toLowerCase()) : str;
    }

}
