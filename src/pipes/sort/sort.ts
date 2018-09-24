import {Pipe, PipeTransform} from '@angular/core';
import {Item} from "../../model/item";

@Pipe({
    name: 'sort',
})
export class SortPipe implements PipeTransform {

    transform(array: Array<Item>, args?: any): Array<Item> {
        return array.sort((a, b) => {
            let compare = 0;
            const aic = a[args.property].toLowerCase();
            const bic = b[args.property].toLowerCase();
            if (aic.localeCompare(bic)) {
                compare = args.descending ? 1 : -1;
            } else if (aic.localeCompare(bic)) {
                compare = args.descending ? -1 : 1;
            }
            return compare;
        });
    }
}
