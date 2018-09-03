import {Component} from '@angular/core';
import {ActionSheetController, AlertController, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Observable} from "rxjs/Observable";
import {NewItemPage} from "../newItem/newItem";
import {OptionsComponent} from "../../components/options/options";
import {ListOptions} from "../../model/listOptions";
import {Item, ItemType} from "../../model/item";
import {List} from "../../model/list";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    itemsList: AngularFireList<any>;
    allLists: AngularFireList<any>;
    items: Observable<any[]>;
    item: any;
    public searchValue: any;

    listOptions: ListOptions = new ListOptions();

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase,
                public popoverCtrl: PopoverController, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController) {

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

        let addModal = this.modalCtrl.create(NewItemPage, {itemName});
        addModal.onDidDismiss(item => {
            if (item) {
                this.addItem(item);
            }
        });
        addModal.present();
    }


    goToListPage(item) {
        this.navCtrl.push(HomePage, item);
    }


    addItem(item: Item) {
        if (item.type === ItemType.List) {
            const newListRef = this.allLists.push({});
            const list = new List(newListRef.key);
            newListRef.set(list);

            item.listRef = list.id;
        }

        const newItemRef = this.itemsList.push({});
        item.id = newItemRef.key;
        newItemRef.set(item);
    }


    executed(item) {
        console.log("item: " + JSON.stringify(item));
        item.active = false;
        this.itemsList.update(item.id, item);
    }
}
