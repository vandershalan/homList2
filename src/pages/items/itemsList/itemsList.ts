import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController, Events} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {ListOptions} from "../../../model/listOptions";
import {Item, ItemType} from "../../../model/item";
import {Category} from "../../../model/category";
import {Observable} from "rxjs";
import {DiacriticsRemoval} from "../../../utils/DiacriticsRemoval";

@IonicPage()
@Component({
    selector: 'page-items-list',
    templateUrl: 'itemsList.html'
})
export class ItemsListPage implements OnInit {

    dbAllLists: AngularFireList<any>;
    dbCurrentItemList: AngularFireList<any>;
    dbCategories: AngularFireList<any>;
    items: Observable<Item[]>;
    categories: Observable<Category[]>;
    item: Item;

    rd = (val) => typeof val === 'string' ? DiacriticsRemoval.removeDiacritics(val.toLowerCase()) : val;

    listOptions: ListOptions = new ListOptions();

    searchValue: string = '';

    private prevCategory: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase,
                public popoverCtrl: PopoverController, public events: Events) {
        this.item = navParams.data;
    }


    ngOnInit() {
        const fireAllListsPath = "/lists";
        const fireCurrentListPath = fireAllListsPath + "/" + this.item.listRef;
        const fireCurrentListItemsPath = fireCurrentListPath + "/items";
        const fireCurrentListCategoriesPath = fireCurrentListPath + "/categories";

        this.dbCategories = this.afDatabase.list(fireCurrentListCategoriesPath);
        this.dbAllLists = this.afDatabase.list(fireAllListsPath);
        this.dbCurrentItemList = this.afDatabase.list(fireCurrentListItemsPath);

        this.categories = this.dbCategories.valueChanges();
        this.items = this.dbCurrentItemList.valueChanges();

        this.categories.subscribe(value => {
            console.log(value)
        });
        this.items.subscribe(value => {
            console.log(value)
        });


        //this.items.pipe(tap(itms => itms.map(itm => console.log(JSON.stringify(itm)))));

        console.log("firePath: " + fireCurrentListPath);
    }


    ionViewWillEnter() {
        console.log('itemList ionViewWillEnter');
        this.events.subscribe('itemsAddedTopic', event => {
            this.clearSearchValue();
        });

    }


    ionViewWillLeave(): void {
        console.log('itemList ionViewWillLeave');
        this.events.unsubscribe('itemsAddedTopic', () => {
            console.log('Unsubscribed itemsAddedTopic');
        });
    }


    isCategoryChanged(currIdx, currCategory): boolean {
        if (currIdx == 0 || currCategory != this.prevCategory) {
            this.prevCategory = currCategory;
            return true;
        }
        return false;
    }


    clearSearchValue() {
        this.searchValue = '';
    }


    showOptionsPopover(myEvent) {
        const popover = this.popoverCtrl.create('ItemsListOptionsComponent', {listOptions: this.listOptions});
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


    goToNewItemPage() {
        //if (this.searchValue == null) this.searchValue = "";
        this.navCtrl.push('NewItemPage', {itemName: this.searchValue, dbAllLists: this.dbAllLists, dbCurrentItemList: this.dbCurrentItemList, dbCategories: this.dbCategories});
    }


    goToListPage(item) {
        this.navCtrl.push('ItemsListPage', item);
    }


    goToEditPage() {
        //this.navCtrl.push(ItemsListPage, item);
    }


    goToCategoriesPage() {
        this.navCtrl.push('CategoriesListPage', {categoryName: null, items: this.items, dbCategories: this.dbCategories, dbCurrentItemList: this.dbCurrentItemList});
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
        this.clearSearchValue();
        this.updateItemInDB(item);
    }

    markAsActive(item: Item) {
        item.active = true;
        this.clearSearchValue();
        this.updateItemInDB(item);
    }


    updateItemInDB(item: Item) {
        //console.log("update item: " + JSON.stringify(item));
        this.dbCurrentItemList.update(item.id, item);
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
                        this.dbCurrentItemList.remove(item.id);
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



