import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
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
export class HomePage implements OnInit {

    dbItemsList: AngularFireList<any>;
    dbAllLists: AngularFireList<any>;
    items: Observable<Item[]>;
    item: Item;
    searchValue: string;

    listOptions: ListOptions = new ListOptions();

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase,
                public popoverCtrl: PopoverController, public modalCtrl: ModalController) {
        this.item = navParams.data;
    }

    ngOnInit() {
        let firePath = "/lists";
        this.dbAllLists = this.afDatabase.list(firePath);
        firePath += "/" + this.item.listRef + "/items";
        this.dbItemsList = this.afDatabase.list(firePath);
        this.items = this.dbItemsList.valueChanges();

        //this.filterItems();

        console.log("firePath: " + firePath);
        console.log(JSON.stringify(this.listOptions));

    }


    filterItems() {
        console.log("filterstartItems");

        if (this.searchValue && this.searchValue.trim() != '') {
            console.log("filterItems 2");
            this.listOptions.showDone = true;
            console.log("filterItems 3");
            //FIXME - nie kumam tego
            //this.items = this.items.map(itms => {
            this.items = this.dbItemsList.valueChanges().map(itms => {
                console.log("itms: " + JSON.stringify(itms));
                return itms.filter((itm) => {
                    console.log("itm: " + JSON.stringify(itm));
                    return (itm.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1);
                })
            })
        } else {
            this.items = this.dbItemsList.valueChanges();
        }
        console.log("filterItems END");
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


    showNewItemPage(itemName) {
        if (itemName == null) itemName = "";

        let addModal = this.modalCtrl.create(NewItemPage, {itemName});
        addModal.onDidDismiss(item => {
            if (item) {
                this.searchValue = null;
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
            const listRef = this.dbAllLists.push({});
            listRef.set(new List(listRef.key, item.name));
            item.listRef = listRef.key;
        }

        const itemRef = this.dbItemsList.push({});
        item.id = itemRef.key;
        itemRef.set(item);
    }


    executed(item: Item) {
        console.log("item: " + JSON.stringify(item));

        if (item.type === ItemType.List) {
        }
        item.active = false;
        this.dbItemsList.update(item.id, item);
    }


    removeItem(item: Item) {
        let alert = this.alertCtrl.create({
            title: 'Confirm removing',
            message: 'Do you really want to remove this item?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel'
                },
                {
                    text: 'Remove',
                    handler: () => {
                        if (ItemType.List === item.type) {
                            this.dbAllLists.remove(item.listRef);
                        }
                        this.dbItemsList.remove(item.id);
                    }
                }
            ]
        });
        alert.present();
    }

}



