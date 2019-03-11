import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AngularFireList} from 'angularfire2/database';
import {Category} from "../../../model/category";

@IonicPage()
@Component({
    selector: 'page-new-category',
    templateUrl: 'newCategory.html',
})
export class NewCategoryPage {

    categoryName: string;
    description: string;

    @ViewChild('nameInput') nameInput;

    dbCategories: AngularFireList<any>;
    maxOrderNo: number;
    clearSearchValueFn;


    constructor(public navParams: NavParams, public viewCtrl: ViewController, public navCtrl: NavController) {
        this.categoryName = navParams.get('categoryName');
        this.dbCategories = navParams.get('dbCategories');
        this.maxOrderNo = navParams.get('maxOrderNo');
        this.clearSearchValueFn = navParams.get('clearSearchValueFn');
        console.log('categoryName: ' + this.categoryName);
    }


    addCategory() {
        const category = new Category(this.categoryName, this.description, this.maxOrderNo);

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
