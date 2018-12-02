import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {NewItemPage} from "../newItem/newItem";
import {OptionsComponent} from "../../components/options/options";
import {ListOptions} from "../../model/listOptions";
import {Item, ItemType} from "../../model/item";
import {List} from "../../model/list";
// import {Category} from "../../model/category";
import {Observable} from "rxjs";
import {DiacriticsRemoval} from "../../utils/DiacriticsRemoval";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {

    dbAllLists: AngularFireList<any>;
    // dbList: AngularFireList<any>;
    dbItemsList: AngularFireList<any>;
    // dbCategories: AngularFireList<any>;
    items: Observable<Item[]>;
    // categories: Observable<Category[]>;
    item: Item;

    rd = (val) => typeof val === 'string' ? DiacriticsRemoval.removeDiacritics(val.toLowerCase()) : val;

    listOptions: ListOptions = new ListOptions();

    searchValue: string;

    private prevCategory: string ;

    //sortOptions: any = {name: this.listOptions.sortField, primer: this.rd, reverse: this.listOptions.sortDesc};

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase,
                public popoverCtrl: PopoverController, public modalCtrl: ModalController) {
        this.item = navParams.data;
    }


    ngOnInit() {
        const fireAllListsPath = "/lists";
        const fireCurrentListPath = fireAllListsPath + "/" + this.item.listRef;
        const fireCurrentListItemsPath = fireCurrentListPath + "/items";
        // const fireCurrentListCategoriesPath = fireCurrentListPath + "/categories";

        this.dbAllLists = this.afDatabase.list(fireAllListsPath);
        this.dbItemsList = this.afDatabase.list(fireCurrentListItemsPath);
        // this.dbCategories = this.afDatabase.list(fireCurrentListCategoriesPath);

        this.items = this.dbItemsList.valueChanges();
        // this.categories = this.dbCategories.valueChanges();

        console.log("firePath: " + fireCurrentListPath);
    }


    isCategoryChanged(currIdx, currCategory) : boolean {
        if (currIdx == 0 || currCategory != this.prevCategory) {
            this.prevCategory = currCategory;
            return true;
        }
        return false;
    }


    showOptions(myEvent) {
        const popover = this.popoverCtrl.create(OptionsComponent, {listOptions: this.listOptions});
        popover.onDidDismiss((optionsData) => {
            if (optionsData) {
                this.listOptions = optionsData.listOptions;
                //this.listOptions = Object.assign({}, optionsData.listOptions);
            }
        });
        popover.present({
            ev: myEvent
        });
    }


    showNewItemPage(itemName) {
        if (itemName == null) itemName = "";

        let addModal = this.modalCtrl.create(NewItemPage, {itemName});
        addModal.onDidDismiss(item => {
            if (item) {
                this.clearSearchValue();
                this.addItem(item);
            }
        });
        addModal.present();
    }


    clearSearchValue () {
        this.searchValue = null;
    }


    goToListPage(item) {
        this.navCtrl.push(HomePage, item);
    }


    goToEditPage(item) {
        //this.navCtrl.push(HomePage, item);
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


    doActionIfSwipeIsEnough(slidingItem, item) {
        // if (slidingItem.getOpenAmount() < -50) {
        if (slidingItem.getSlidingPercent() < -1.1) {
            this.markAsDone(item);
        }
    }


    markAsDone(item: Item) {
        if (item.type === ItemType.List) {
        }
        item.active = false;
        this.updateItemInDB(item);
    }

    markAsActive(item: Item) {
        item.active = true;
        this.clearSearchValue();
        this.updateItemInDB(item);
    }


    updateItemInDB(item: Item) {
        //console.log("update item: " + JSON.stringify(item));
        this.dbItemsList.update(item.id, item);
    }



    reorderItems(indexes) {
        console.log (indexes.from + " " + indexes.to);
        let element = this.items[indexes.from];
        console.log (element);
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


    consoleLog(str: string) {
        console.log(str);
    }
}



