import {Component} from '@angular/core';
import {ActionSheetController, AlertController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Observable} from "rxjs/Observable";
import {NewItemPage} from "../newItem/newItem";
import {OptionsComponent} from "../../components/options/options";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    itemsList: AngularFireList<any>;
    allLists: AngularFireList<any>;
    items: Observable<any[]>;
    item: any;
    searchValue: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase, public popoverCtrl: PopoverController, public actionSheetCtrl: ActionSheetController) {
        this.item = navParams.data;
        let firePath = "/lists";
        this.allLists = afDatabase.list(firePath);
        firePath += "/" + this.item.id + "/items";
        this.itemsList = afDatabase.list(firePath);
        this.items = this.itemsList.valueChanges();
        console.log("firePath: " + firePath);
    }


    addItem() {
        let prompt = this.alertCtrl.create({
            title: 'Item Name',
            message: "Enter a name for this new item",
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Name'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        const newListRef = this.itemsList.push({});

                        newListRef.set({
                            id: newListRef.key,
                            name: data.name,
                            type: "item"
                        });
                    }
                }
            ]
        });
        prompt.present();
    }

    showOptions(myEvent) {
        let popover = this.popoverCtrl.create(OptionsComponent);
        popover.present({
            ev: myEvent
        });
    }

    show2Options(listId, listName) {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'What do you want to do with: ' + listName + '?',
            buttons: [
                {
                    text: 'Delete List',
                    role: 'destructive',
                    handler: () => {
                        this.removeItem(listId);
                    }
                }, {
                    text: 'Update name',
                    handler: () => {
                        this.updateList(listId, listName);
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }


    removeItem(item) {
        this.itemsList.remove(item);
    }


    updateList(listId, listName) {
        let prompt = this.alertCtrl.create({
            title: 'List Name',
            message: "Update the name for this list",
            inputs: [
                {
                    name: 'name',
                    placeholder: 'Name',
                    value: listName
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        this.itemsList.update(listId, {
                            name: data.name
                        });
                    }
                }
            ]
        });
        prompt.present();
    }

    goToNewItemPage(itemName) {
        if (itemName == null) itemName = "";
        this.navCtrl.push(NewItemPage, {itemName: itemName, itemsList: this.itemsList, allLists: this.allLists});
    }

    goToListPage(item) {
        this.navCtrl.push(HomePage, item);
    }

    executed(item) {
        console.log("item: " + JSON.stringify(item));
        item.active = false;
        this.itemsList.update(item.id, item);
    }
}
