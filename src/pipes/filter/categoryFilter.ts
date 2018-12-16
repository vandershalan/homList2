import {Pipe, PipeTransform} from '@angular/core';
import {DiacriticsRemoval} from "../../utils/DiacriticsRemoval";
import {Category} from "../../model/category";


@Pipe({
    name: 'categoryFilter',
})
export class CategoryFilterPipe implements PipeTransform {

    transform(categories: Category[], searchValue: string): Category[] {

        if (!categories) return [];

        if (searchValue) {
            searchValue = this.normalize(searchValue);
            categories = categories.filter(category => (this.normalize(category.name).includes(searchValue)));
        }

        return categories;
    }


    normalize(str: string): string {
        return str ? DiacriticsRemoval.removeDiacritics(str.toLowerCase()) : str;
    }

}
