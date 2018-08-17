import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFireList} from "angularfire2/database";

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
        newItemRef.set({
            id: newItemRef.key,
            name: this.itemName,
            type: "item"
        });

        this.navCtrl.pop();
    }


    addList() {
        const newListRef = this.allLists.push({});
        newListRef.set({
            id: newListRef.key,
            name: this.itemName,
            type: "list"
        });

        const newItemRef = this.itemsList.push({});
        newItemRef.set({
            id: newItemRef.key,
            name: this.itemName,
            type: "list",
            listRef: newListRef.key
        });

        this.navCtrl.pop();
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad NewItemPage');
        setTimeout(() => {
            this.nameInput.setFocus();
        },500);
    }

    // ngAfterViewChecked() {
    //     this.nameInput.setFocus()
    // }
}
