import {Component, OnInit} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Category} from "../../../model/category";
import {Observable, Subscription} from "rxjs";
import {filter, map} from "rxjs/operators";
import {SortPipe} from "../../../pipes/sort/sort";
import {CategoriesNewPage} from "../new/categoriesNew";
import {Item} from "../../../model/item";

@Component({
    selector: 'page-categories-list',
    templateUrl: 'categoriesList.html'
})
export class CategoriesListPage implements OnInit {

    items: Observable<Item[]>;
    dbCurrentItemList: AngularFireList<any>;
    dbCategories: AngularFireList<any>;
    categories: Observable<Category[]>;
    categoryName: string;
    setCategoryNameFn;
    searchValue: string = '';
    categoriesArray: Category[] = [];
    itemsArray: Item[] = [];

    private categoriesSubscription: Subscription;
    private itemsSubscription: Subscription;

    clearSearchValueFn = () => {this.searchValue = ''};


    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase) {
        this.categoryName = navParams.get('categoryName');
        this.items = navParams.get('items');
        this.dbCurrentItemList = navParams.get('dbCurrentItemList');
        this.dbCategories = navParams.get('dbCategories');
        this.setCategoryNameFn = navParams.get('setCategoryNameFn');
    }


    ngOnInit() {
        this.categories = this.dbCategories.valueChanges().pipe(map(ctgrs => new SortPipe().transform(ctgrs, ['order'])));

        this.categoriesSubscription = this.categories.subscribe(ctgrs => {this.categoriesArray = ctgrs as Category[]});
        this.categories.subscribe(value => {console.log(value)});

        this.itemsSubscription = this.items.subscribe(itms => {this.itemsArray = itms as Item[]});
    }


    ionViewWillLeave(): void {
        console.log('ionViewWillLeave');
        this.categoriesSubscription.unsubscribe();
        this.itemsSubscription.unsubscribe();
    }


    goToNewCategoryPage() {
        const maxOrderNo = this.categoriesArray[this.categoriesArray.length - 1].order;
        this.navCtrl.push(CategoriesNewPage, {categoryName: this.searchValue, dbCategories: this.dbCategories, maxOrderNo: maxOrderNo, clearSearchValueFn: this.clearSearchValueFn});
    }


    goToEditPage(category) {
        //this.navCtrl.push(HomePage, item);
    }


    categoryChosen() {
        this.setCategoryNameFn((this.categoryName));
        this.navCtrl.pop();
    }


    reorderCategories(indexes) {

        // console.log(indexes.from + " " + indexes.to);

        this.categoriesArray[indexes.from].order = indexes.to;
        this.updateCategoryAndItemsInDB(this.categoriesArray[indexes.from]);

        if (indexes.from < indexes.to) {
            for (let i = indexes.from; i < indexes.to; i ++) {
                this.categoriesArray[i + 1].order = i;
                this.updateCategoryAndItemsInDB(this.categoriesArray[i + 1]);
            }
        } else {
            for (let i = indexes.to; i < indexes.from; i ++) {
                this.categoriesArray[i].order = i + 1;
                this.updateCategoryAndItemsInDB(this.categoriesArray[i]);
            }
        }
    }


    updateCategoryAndItemsInDB(category: Category) {
        console.log("updateCategoryAndItemsInDB: " + JSON.stringify(category));
        this.dbCategories.update(category.id, category);
        this.updateItems4Category(category);
    }


    updateItems4Category(category: Category) {
        console.log("updateItems4Category: " + JSON.stringify(category));
        this.itemsArray.filter(itm => itm.categoryName === category.name).map(itm => this.updateItemOrderInDB(itm, category.order));
    }


    updateItemOrderInDB(item: Item, newOrder: number) {
        console.log("updateItemOrderInDB: " + JSON.stringify(item), newOrder);
        this.dbCurrentItemList.update(item.id, {categoryOrder: newOrder});
    }


    removeCategory(category: Category) {
        if (this.itemsArray.some(itm => itm.categoryName === category.name)) {
            let alert = this.alertCtrl.create({
                title: 'Category in use',
                message: 'There are items (active or done) belong to this category.<p>Removing such category is forbidden.',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    }
                ]
            });
            alert.present();
        } else {
            let alert = this.alertCtrl.create({
                title: 'Confirm removing',
                message: 'Do you really want to remove this category?',
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    },
                    {
                        text: 'Remove',
                        handler: () => {
                            this.dbCategories.remove(category.id);
                        }
                    }
                ]
            });
            alert.present();
        }
    }


    consoleLog(str: string) {
        console.log(str);
    }
}



