import {Component, OnInit} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Category} from "../../model/category";
import {Observable} from "rxjs";
import {List} from "../../model/list";
import {map} from "rxjs/operators";
import {SortPipe} from "../../pipes/sort/sort";

@Component({
    selector: 'page-categories',
    templateUrl: 'categories.html'
})
export class CategoriesPage implements OnInit {

    dbCategories: AngularFireList<any>;
    categories: Observable<Category[]>;
    list: List;
    category: Category;
    categoryName: string;

    setCategoryNameFn;

    searchValue: string = '';

    categoriesArray = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase) {
        this.categoryName = navParams.get('categoryName');
        this.dbCategories = navParams.get('dbCategories');
        this.setCategoryNameFn = navParams.get('setCategoryNameFn');
    }


    ngOnInit() {
        this.categories = this.dbCategories.valueChanges().pipe(map(ctgrs => new SortPipe().transform(ctgrs, ['order'])));

        this.categories.subscribe(ctgrs => {
            this.categoriesArray = ctgrs as Category[]
        });

        this.categories.subscribe(value => {
            console.log(value)
        });
    }


    goToEditPage(category) {
        //this.navCtrl.push(HomePage, item);
    }


    addCategory(category: Category) {
        const categoryRef = this.dbCategories.push({});
        category.id = categoryRef.key;
        categoryRef.set(category);
    }


    updateCategoryInDB(category: Category) {
        console.log("update category: " + JSON.stringify(category));
        this.dbCategories.update(category.id, category);
    }


    categoryChosen() {
        this.setCategoryNameFn((this.categoryName));
        this.navCtrl.pop();
    }


    reorderCategories(indexes) {

        // console.log(indexes.from + " " + indexes.to);

        this.categoriesArray[indexes.from].order = indexes.to;
        this.updateCategoryInDB(this.categoriesArray[indexes.from]);

        if (indexes.from < indexes.to) {
            for (let i = indexes.from; i < indexes.to; i ++) {
                this.categoriesArray[i + 1].order = i;
                this.updateCategoryInDB(this.categoriesArray[i + 1]);
            }
        } else {
            for (let i = indexes.to; i < indexes.from; i ++) {
                this.categoriesArray[i].order = i + 1;
                this.updateCategoryInDB(this.categoriesArray[i]);
            }
        }
    }


    removeCategory(category: Category) {
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


    consoleLog(str: string) {
        console.log(str);
    }
}



