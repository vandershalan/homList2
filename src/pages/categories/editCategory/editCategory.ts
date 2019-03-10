import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AngularFireList} from 'angularfire2/database';
import {Category} from "../../../model/category";

@IonicPage()
@Component({
    selector: 'page-edit-category',
    templateUrl: 'editCategory.html',
})
export class EditCategoryPage {

    category: Category;

    @ViewChild('nameInput') nameInput;

    dbCategories: AngularFireList<any>;


    constructor(public navParams: NavParams, public viewCtrl: ViewController, public navCtrl: NavController) {
        this.category = navParams.get('category');
        this.dbCategories = navParams.get('dbCategories');
        console.log('categoryName: ' + this.category.name);
    }


    updateCategory() {
        this.dbCategories.update(this.category.id, this.category);
        this.navCtrl.pop();
    }


    ionViewDidLoad() {
        setTimeout(() => {
            this.nameInput.setFocus();
        }, 500);
    }

}
