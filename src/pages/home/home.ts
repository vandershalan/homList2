import {Component} from '@angular/core';
import {ActionSheetController, AlertController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Observable} from "rxjs/Observable";
import {NewItemPage} from "../newItem/newItem";
import {OptionsComponent} from "../../components/options/options";
import {ListOptions} from "../../model/listOptions";

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

    listOptions: ListOptions = new ListOptions();

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase,
                public popoverCtrl: PopoverController, public actionSheetCtrl: ActionSheetController) {

        this.item = navParams.data;
        let firePath = "/lists";
        this.allLists = afDatabase.list(firePath);
        firePath += "/" + this.item.id + "/items";
        this.itemsList = afDatabase.list(firePath);
        this.items = this.itemsList.valueChanges();

        console.log("firePath: " + firePath);
        console.log(JSON.stringify(this.listOptions));
    }


    showOptions(myEvent) {
        const popover = this.popoverCtrl.create(OptionsComponent, {listOptions: this.listOptions});
        popover.onDidDismiss((optionsData) => {
            if (optionsData) {
                this.listOptions = optionsData.listOptions;
            }
        })
        popover.present({
            ev: myEvent
        });
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
