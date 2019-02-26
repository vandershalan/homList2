import {Pipe, PipeTransform} from '@angular/core';
import {Item} from "../../model/item";
import {Category} from "../../model/category";


@Pipe({
    name: 'filterUnusedCategories',
})
export class FilterUnusedCategoriesPipe implements PipeTransform {
    transform(categories: Category[], items: Item[]): Category[] {
        if (!categories || !items) return [];
        return categories.filter(category => {
            return items.find(item => item.categoryId === category.id);
        });
    }
}
