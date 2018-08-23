export class Item {

    constructor(id: String, name: String, type: ItemType, listRef: String) {};
}



export enum ItemType {
    Item = "ITEM",
    List = "LIST"
}