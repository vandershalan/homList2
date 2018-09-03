export class Item {

    public id: String;
    active :boolean = true;

    constructor(public name: String, public description: String = null, public type: ItemType = ItemType.Item, public listRef: String = null) {

    };
}


export enum ItemType {
    Item = "item",
    List = "list"
}