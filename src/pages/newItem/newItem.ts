import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Item, ItemType} from "../../model/item";
import {CategoriesListPage} from "../categories/list/categoriesList";
import {List} from "../../model/list";
import {AngularFireList} from 'angularfire2/database';
import {Category} from "../../model/category";
import {filter, find, map} from "rxjs/operators";
import {SortPipe} from "../../pipes/sort/sort";
import {Subscription} from "rxjs";


@Component({
    selector: 'new-item',
    templateUrl: 'newItem.html',
})
export class NewItemPage {

    DEFAULT_CATEGORY_NAME = 'Bez kategorii';

    itemName: string;
    description: string;
    category: Category = new Category(this.DEFAULT_CATEGORY_NAME, '', 100);

    itemType: typeof ItemType = ItemType;
    @ViewChild('nameInput') nameInput;

    dbAllLists: AngularFireList<any>;
    dbCurrentItemList: AngularFireList<any>;
    dbCategories: AngularFireList<Category>;

    private categoriesSubscription: Subscription;

    clearSearchValueFn;

    setCategoryFn = (category) => {this.category = category};


    constructor(public navParams: NavParams, public navCtrl: NavController) {
        this.itemName = navParams.get('itemName');
        this.dbAllLists = navParams.get('dbAllLists');
        this.dbCurrentItemList = navParams.get('dbCurrentItemList');
        this.dbCategories = navParams.get('dbCategories');

        this.clearSearchValueFn = navParams.get('clearSearchValueFn');

        console.log('itemName: ' + this.itemName);
    }


    ngOnInit() {
        this.categoriesSubscription = this.dbCategories.valueChanges().pipe(map(ctgrs => ctgrs.find(ctgr => (ctgr.isDefault)))).subscribe(ctgr => {ctgr ? this.category = ctgr : ''});
    }


    addItem(itemType: ItemType) {

        const item = new Item(this.itemName, this.description, itemType);

        if (this.category) {
            item.categoryName = this.category.name;
            item.categoryOrder = this.category.order;
        }

        if (item.type === ItemType.List) {
            const listRef = this.dbAllLists.push({});
            listRef.set(new List(listRef.key, item.name));
            item.listRef = listRef.key;
        }

        const itemRef = this.dbCurrentItemList.push({});
        item.id = itemRef.key;
        itemRef.set(item);

        this.clearSearchValueFn();
        this.navCtrl.pop();
    }


    goToCategoriesPage() {
        this.navCtrl.push(CategoriesListPage, {categoryName: this.category.name, dbCategories: this.dbCategories, dbCurrentItemList: this.dbCurrentItemList, setCategoryNameFn: this.setCategoryFn});
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad NewItemPage');
        setTimeout(() => {
            this.nameInput.setFocus();
        }, 500);
    }

}
