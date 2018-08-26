import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFireList} from "angularfire2/database";
import {Item, ItemType} from "../../model/item";

@Component({
    selector: 'new-item',
    templateUrl: 'newItem.html',
})
export class NewItemPage {

    itemName: any;
    itemsList: AngularFireList<any>;
    allLists: AngularFireList<any>;

    @ViewChild('nameInput') nameInput;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.itemName = navParams.get('itemName');
        this.itemsList = navParams.get('itemsList');
        this.allLists = navParams.get('allLists');
    }

    addItem() {
        const newItemRef = this.itemsList.push({});
        const item = new Item(newItemRef.key, this.itemName);
        newItemRef.set(item);

        this.navCtrl.pop();
    }


    addList() {
        const newListRef = this.allLists.push({});
        let list = new Item(newListRef.key, this.itemName, ItemType.List);
        newListRef.set(list);

        const newItemRef = this.itemsList.push({});
        list.id = newItemRef.key;
        list.listRef = newListRef.key;
        newItemRef.set(list);

        this.navCtrl.pop();
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
