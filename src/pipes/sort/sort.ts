import {Pipe, PipeTransform} from '@angular/core';
import {Item} from "../../model/item";

@Pipe({
    name: 'sort',
})
export class SortPipe implements PipeTransform {

    transform(array: Array<Item>, args?: any): Array<Item> {
        return array.sort((a, b) => {
            if (a[args.property] < b[args.property]) {
                return -1 * args.order;
            }
            else if (a[args.property] > b[args.property]) {
                return 1 * args.order;
            }
            else {
                return 0;
            }
        });
    }
}
