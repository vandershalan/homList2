import {Component, ViewChild} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {Item, ItemType} from "../../model/item";

@Component({
    selector: 'new-item',
    templateUrl: 'newItem.html',
})
export class NewItemPage {

    itemName: string;
    description: string;

    itemType: typeof ItemType = ItemType;

    @ViewChild('nameInput') nameInput;

    constructor(public navParams: NavParams, public viewCtrl: ViewController) {
        this.itemName = navParams.get('itemName');
        console.log('itemName: ' + this.itemName);
    }


    addItem(itemType: ItemType) {
        const item = new Item(this.itemName, this.description, itemType);
        this.viewCtrl.dismiss(item);
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad NewItemPage');
        setTimeout(() => {
            this.nameInput.setFocus();
        }, 500);
    }

    // ngAfterViewChecked() {
    //     this.nameInput.setFocus()
    // }
}
