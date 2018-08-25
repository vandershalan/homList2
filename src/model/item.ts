export class Item {

    active :boolean = true;

    constructor(public id: String, public name: String, public type: ItemType, public listRef: String) {};
}



export enum ItemType {
    Item = "item",
    List = "list"
}