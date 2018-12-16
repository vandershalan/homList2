import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController, NavOptions, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {NewItemPage} from "../newItem/newItem";
import {OptionsComponent} from "../../components/options/options";
import {ListOptions} from "../../model/listOptions";
import {Item, ItemType} from "../../model/item";
import {List} from "../../model/list";
import {Category} from "../../model/category";
import {Observable} from "rxjs";
import {DiacriticsRemoval} from "../../utils/DiacriticsRemoval";
import {CategoriesPage} from "../categories/categories";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {

    dbAllLists: AngularFireList<any>;
    dbCurrentItemList: AngularFireList<any>;
    dbCategories: AngularFireList<any>;
    items: Observable<Item[]>;
    categories: Observable<Category[]>;
    item: Item;

    rd = (val) => typeof val === 'string' ? DiacriticsRemoval.removeDiacritics(val.toLowerCase()) : val;

    listOptions: ListOptions = new ListOptions();

    searchValue: string = '';

    clearSearchValueFn = () => {this.searchValue = ''};


    private prevCategory: string ;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase,
                public popoverCtrl: PopoverController, public modalCtrl: ModalController) {
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

        this.categories = this.dbCategories.valueChanges(); //.pipe(tap (cts => cts.map (ct => this.items.pipe(map(itms => itms.filter(itm => itm.category === ct.name))))));
        this.items = this.dbCurrentItemList.valueChanges(); //.pipe(map( itms => itms.map(itm => {this.categories.pipe(map (cts => cts.find(c => c.name === itm.category)), map(c => {return c ? c.order : 999})).subscribe(o => {itm.categoryOrder = o}); return itm})));;

        this.categories.subscribe(value => {console.log(value)});
        this.items.subscribe(value => {console.log(value)});


        //this.items.pipe(tap(itms => itms.map(itm => console.log(JSON.stringify(itm)))));

        console.log("firePath: " + fireCurrentListPath);
    }


    isCategoryChanged(currIdx, currCategory) : boolean {
        if (currIdx == 0 || currCategory != this.prevCategory) {
            this.prevCategory = currCategory;
            return true;
        }
        return false;
    }


    showOptionsPopover(myEvent) {
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


    goToNewItemPage(item) {
        //if (this.searchValue == null) this.searchValue = "";
        this.navCtrl.push(NewItemPage, {itemName: this.searchValue, dbAllLists: this.dbAllLists, dbCurrentItemList: this.dbCurrentItemList, dbCategories: this.dbCategories, clearSearchValueFn: this.clearSearchValueFn});
    }


    goToListPage(item) {
        this.navCtrl.push(HomePage, item);
    }


    goToEditPage(item) {
        //this.navCtrl.push(HomePage, item);
    }


    goToCategoriesPage() {
        this.navCtrl.push(CategoriesPage, {categoryName: null, dbCategories: this.dbCategories});
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
        this.clearSearchValueFn();
        this.updateItemInDB(item);
    }

    markAsActive(item: Item) {
        item.active = true;
        this.clearSearchValueFn();
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



