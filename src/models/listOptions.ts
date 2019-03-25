export class ListOptions {
    showCategories: boolean = true;
    showActive: boolean = true;
    showDone: boolean = false;
    searchInActive: boolean = true;
    searchInDone: boolean = true;
    sortField: string = 'item.name';
    sortDesc: boolean = false;
}