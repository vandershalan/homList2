import {Pipe, PipeTransform} from '@angular/core';
import {SortFnFactory} from "../../utils/SortFnFactory";


@Pipe({
    name: 'sort',
})
export class SortPipe implements PipeTransform {

    transform(entries: any[], sortOptions: any[]): any[] {

        if (!entries) return [];

        // console.log("SortPipe: fullSortOptions: " + JSON.stringify(sortOptions));

        return entries.sort(SortFnFactory.getSortFn(sortOptions));
    }
}
