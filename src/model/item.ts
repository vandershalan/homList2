export class Item {

    active :boolean = true;

    constructor(public id: String, public name: String, public type: ItemType = ItemType.Item, public listRef: String = null) {};
}


export enum ItemType {
    Item = "item",
    List = "list"
}