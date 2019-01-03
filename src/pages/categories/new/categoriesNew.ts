import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Item, ItemType} from "../../../model/item";
import {CategoriesListPage} from "../list/categoriesList";
import {List} from "../../../model/list";
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Category} from "../../../model/category";


@Component({
    selector: 'page-categories-new',
    templateUrl: 'categoriesNew.html',
})
export class CategoriesNewPage {

    categoryName: string;
    description: string;

    @ViewChild('nameInput') nameInput;

    dbCurrentItemList: AngularFireList<any>;
    dbCategories: AngularFireList<any>;

    clearSearchValueFn;

    setCategoryNameFn = (categoryName) => {this.categoryName = categoryName};


    constructor(public navParams: NavParams, public viewCtrl: ViewController, public navCtrl: NavController) {
        this.categoryName = navParams.get('categoryName');
        this.dbCurrentItemList = navParams.get('dbCurrentItemList');
        this.dbCategories = navParams.get('dbCategories');

        this.clearSearchValueFn = navParams.get('clearSearchValueFn');
        // this.list = navParams.get('list');
        console.log('categoryName: ' + this.categoryName);
    }


    addCategory() {

        const category = new Category(this.categoryName, this.description);

        const categoryRef = this.dbCategories.push({});
        category.id = categoryRef.key;
        categoryRef.set(category);

        this.clearSearchValueFn();
        this.navCtrl.pop();
    }



    ionViewDidLoad() {
        setTimeout(() => {
            this.nameInput.setFocus();
        }, 500);
    }

}
