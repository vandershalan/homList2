import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Item, ItemType} from "../../model/item";
import {CategoriesListPage} from "../categories/list/categoriesList";
import {List} from "../../model/list";
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';


@Component({
    selector: 'new-item',
    templateUrl: 'newItem.html',
})
export class NewItemPage {

    itemName: string;
    description: string;
    categoryName: string;

    itemType: typeof ItemType = ItemType;
    @ViewChild('nameInput') nameInput;

    dbAllLists: AngularFireList<any>;
    dbCurrentItemList: AngularFireList<any>;
    dbCategories: AngularFireList<any>;

    clearSearchValueFn;

    setCategoryNameFn = (categoryName) => {this.categoryName = categoryName};


    constructor(public navParams: NavParams, public viewCtrl: ViewController, public navCtrl: NavController) {
        this.itemName = navParams.get('itemName');
        this.dbAllLists = navParams.get('dbAllLists');
        this.dbCurrentItemList = navParams.get('dbCurrentItemList');
        this.dbCategories = navParams.get('dbCategories');

        this.clearSearchValueFn = navParams.get('clearSearchValueFn');
        // this.list = navParams.get('list');
        console.log('itemName: ' + this.itemName);
    }


    addItem(itemType: ItemType) {

        const item = new Item(this.itemName, this.description, itemType);

        if (this.categoryName) {
            item.categoryName = this.categoryName;
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
        this.navCtrl.push(CategoriesListPage, {categoryName: this.categoryName, dbCategories: this.dbCategories, setCategoryNameFn: this.setCategoryNameFn});
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad NewItemPage');
        setTimeout(() => {
            this.nameInput.setFocus();
        }, 500);
    }

}
