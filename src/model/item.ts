export class Item {

    public id: string;
    public active: boolean = true;
    public listRef: string;
    public category: string = "default";

    constructor(public name: string, public description: string = null, public type: ItemType = ItemType.Item) {

    };
}


export enum ItemType {
    Item = "item",
    List = "list"
}