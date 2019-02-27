import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Events, List} from 'ionic-angular';
import {AngularFireList} from 'angularfire2/database';
import {Category} from "../../../model/category";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {SortPipe} from "../../../pipes/sort/sort";
import {Item} from "../../../model/item";

@IonicPage()
@Component({
    selector: 'page-categories-list',
    templateUrl: 'categoriesList.html'
})
export class CategoriesListPage implements OnInit {

    @ViewChild(List) ionList: List;

    items: Observable<Item[]>;
    dbCurrentItemList: AngularFireList<any>;
    dbCategories: AngularFireList<any>;
    categories: Observable<Category[]>;
    categoryId: string;
    searchValue: string = '';
    categoriesArray: Category[] = [];
    itemsArray: Item[] = [];

    private categoriesSubscription: Subscription;
    private itemsSubscription: Subscription;

    clearSearchValueFn = () => {this.searchValue = ''};


    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public events: Events) {
        this.categoryId = navParams.get('categoryId');
        this.dbCurrentItemList = navParams.get('dbCurrentItemList');
        this.dbCategories = navParams.get('dbCategories');
    }


    ngOnInit() {
        console.log('ngOnInit');
        this.categories = this.dbCategories.valueChanges().pipe(map(ctgrs => new SortPipe().transform(ctgrs, ['order'])));
        this.categories.subscribe(value => {console.log(value)});
    }


    ionViewWillEnter() {
        console.log('ionViewWillEnter');
        this.ionList.closeSlidingItems();
        this.itemsSubscription = this.dbCurrentItemList.valueChanges().subscribe(itms => {this.itemsArray = itms as Item[]});
        this.categoriesSubscription = this.categories.subscribe(ctgrs => {this.categoriesArray = ctgrs as Category[]});
    }


    ionViewWillLeave(): void {
        console.log('ionViewWillLeave');
        this.categoriesSubscription.unsubscribe();
        this.itemsSubscription.unsubscribe();
    }


    categoryChosen() {
        const chosenCategory = this.getCategory4Id(this.categoryId);
        this.events.publish('selectedCategoryTopic', chosenCategory);
        this.navCtrl.pop();
    }


    getCategory4Id(categoryId: string): Category {
        return this.categoriesArray.find(cat => cat.id === categoryId);
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
        // this.updateItems4Category(category);
    }


    // updateItems4Category(category: Category) {
    //     console.log("updateItems4Category: " + JSON.stringify(category));
    //     this.itemsArray.filter(itm => itm.categoryName === category.name).map(itm => this.updateItemOrderInDB(itm, category.order));
    // }


    // updateItemOrderInDB(item: Item, newOrder: number) {
    //     console.log("updateItemOrderInDB: " + JSON.stringify(item), newOrder);
    //     this.dbCurrentItemList.update(item.id, {categoryOrder: newOrder});
    // }


    goToNewCategoryPage() {
        const maxOrderNo = this.categoriesArray[this.categoriesArray.length - 1].order;
        this.navCtrl.push('NewCategoryPage', {categoryName: this.searchValue, dbCategories: this.dbCategories, maxOrderNo: maxOrderNo, clearSearchValueFn: this.clearSearchValueFn});
    }


    goToEditCategoryPage(category: Category) {
        this.navCtrl.push('EditCategoryPage', {category: category, dbCategories: this.dbCategories});
    }


    removeCategory(category: Category) {
        if (this.itemsArray.some(itm => itm.categoryId === category.id)) {
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



