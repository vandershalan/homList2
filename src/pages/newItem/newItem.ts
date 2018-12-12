import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Item, ItemType} from "../../model/item";
import {CategoriesPage} from "../categories/categories";
import {List} from "../../model/list";

@Component({
    selector: 'new-item',
    templateUrl: 'newItem.html',
})
export class NewItemPage {

    itemName: string;
    list: List;
    description: string;
    categoryName: string;

    itemType: typeof ItemType = ItemType;
    @ViewChild('nameInput') nameInput;

    constructor(public navParams: NavParams, public viewCtrl: ViewController, public navCtrl: NavController) {
        this.itemName = navParams.get('itemName');
        this.list = navParams.get('list');
        console.log('itemName: ' + this.itemName);
    }


    addItem(itemType: ItemType) {
        const item = new Item(this.itemName, this.description, itemType);
        if (this.categoryName) {
            item.category = this.categoryName;
        }
        this.dismiss(item);
    }


    goToCategoriesPage() {
        this.navCtrl.push(CategoriesPage, {categoryName: this.categoryName, list: this.list});
    }


    dismiss(item?: Item) {
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
