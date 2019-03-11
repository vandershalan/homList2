import {Component, OnInit} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, PopoverController, Events} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {ListOptions} from "../../../model/listOptions";
import {Item, ItemType} from "../../../model/item";
import {Category} from "../../../model/category";
import {Subscription} from "rxjs";
import {DiacriticsRemoval} from "../../../utils/DiacriticsRemoval";
import {ItemWithCategory} from "../../../model/itemWithCategory";

@IonicPage()
@Component({
    selector: 'page-items-list',
    templateUrl: 'itemsList.html'
})
export class ItemsListPage implements OnInit {

    public static fireAllListsPath = "/lists";

    dbAllLists: AngularFireList<any>;
    dbCurrentItemList: AngularFireList<any>;
    dbCategories: AngularFireList<any>;
    items: Item[] = [];
    itemsWithCategory: ItemWithCategory[] = [];
    categories: Category[] = [];
    item: Item;
    CATEGORY_WITHOUT_CATEGORY_NAME = Category.WITHOUT_CATEGORY_NAME;

    private categoriesSubscription: Subscription;
    private itemsSubscription: Subscription;

    rd = (val) => typeof val === 'string' ? DiacriticsRemoval.removeDiacritics(val.toLowerCase()) : val;

    listOptions: ListOptions = new ListOptions();

    searchValue: string = '';

    private prevCategory: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase,
                public popoverCtrl: PopoverController, public events: Events) {
        this.item = navParams.data;
    }


    ngOnInit() {
        const fireCurrentListPath = ItemsListPage.fireAllListsPath + "/" + this.item.listRef;
        const fireCurrentListItemsPath = fireCurrentListPath + "/items";
        const fireCurrentListCategoriesPath = fireCurrentListPath + "/categories";

        this.dbAllLists = this.afDatabase.list(ItemsListPage.fireAllListsPath);
        this.dbCategories = this.afDatabase.list(fireCurrentListCategoriesPath);
        this.dbCurrentItemList = this.afDatabase.list(fireCurrentListItemsPath);

        console.log("firePath: " + fireCurrentListPath);
    }


    // ngDoCheck() {
    //     console.log('itemList ngDoCheck');
    // }


    ionViewWillEnter() {
        console.log('itemList ionViewWillEnter');

        this.categoriesSubscription = this.dbCategories.valueChanges().subscribe(ctgrs => {this.categories = ctgrs as Category[]; this.appendCategories2Items()});
        this.itemsSubscription = this.dbCurrentItemList.valueChanges().subscribe(itms => {this.items = itms as Item[]; this.appendCategories2Items()});

        this.events.subscribe('itemsAddedTopic', event => {
            this.clearSearchValue();
        });

    }


    ionViewWillLeave(): void {
        console.log('itemList ionViewWillLeave');

        this.categoriesSubscription.unsubscribe();
        this.itemsSubscription.unsubscribe();

        this.events.unsubscribe('itemsAddedTopic', () => {
            console.log('Unsubscribed itemsAddedTopic');
        });
    }


    appendCategories2Items() {
        console.log('itemList appendCategories2Items');
        console.log("items: ", this.items);
        console.log("categories: ", this.categories);
        this.itemsWithCategory = this.items.map(itm => {const itmWC = new ItemWithCategory(); itmWC.item = itm; return itmWC});
        this.itemsWithCategory.map(itmWC => {const category = this.categories.find(ctgr => ctgr.id === itmWC.item.categoryId); itmWC.category = category ? category : Category.CATEGORY_WITHOUT_CATEGORY; return itmWC});
        console.log("items with categories: ", this.itemsWithCategory);
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


    goToItemsListPage(item) {
        this.navCtrl.push('ItemsListPage', item);
    }


    goToNewItemPage() {
        //if (this.searchValue == null) this.searchValue = "";
        this.navCtrl.push('NewItemPage', {itemName: this.searchValue, dbAllLists: this.dbAllLists, dbCurrentItemList: this.dbCurrentItemList, dbCategories: this.dbCategories});
    }


    goToEditItemPage(itemWC: ItemWithCategory) {
        this.navCtrl.push('EditItemPage', {itemWithCategory: itemWC, dbAllLists: this.dbAllLists, dbCurrentItemList: this.dbCurrentItemList, dbCategories: this.dbCategories});
    }


    goToCategoriesPage() {
        this.navCtrl.push('CategoriesListPage', {showRadio: false, categoryId: null, dbCategories: this.dbCategories, dbCurrentItemList: this.dbCurrentItemList});
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



