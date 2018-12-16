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

    cat2 = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase) {
        this.categoryName = navParams.get('categoryName');
        this.dbCategories = navParams.get('dbCategories');
        this.setCategoryNameFn = navParams.get('setCategoryNameFn');
    }


    ngOnInit() {
        this.categories = this.dbCategories.valueChanges().pipe(map(ctgrs => new SortPipe().transform(ctgrs, ['order'])));

        this.categories.subscribe(ctgrs => {this.cat2 = ctgrs as Category[]});

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
        console.log(indexes.from + " " + indexes.to);
        // let c2: Observable<Category[]>;

        // c2 = this.categories.pipe(map(ctgrs => ctgrs.map((ctgr, i) => {if (i === indexes.from) {ctgr.order = ctgr.order + 100};return ctgr})));

        // c2.subscribe(ctgrs => {this.cat2 = ctgrs as Category[]});

        this.cat2[indexes.from].order = indexes.to;
        for (let i = indexes.from; i < indexes.to; i++) {
            this.cat2[i + 1].order = i;
        }

        for (let i = 0; i < this.cat2.length; i++) {
            console.log(this.cat2[i]);
        }

        //this.categories = c2.pipe(map(ctgrs => new SortPipe().transform(ctgrs, ['order'])));

        //let element = this.categories[indexes.from];
        // console.log(c2);
        // c2.subscribe(value => {console.log(value)});

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



