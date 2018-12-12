import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams, PopoverController} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Category} from "../../model/category";
import {Observable} from "rxjs";
import {DiacriticsRemoval} from "../../utils/DiacriticsRemoval";
import {List} from "../../model/list";

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

    rd = (val) => typeof val === 'string' ? DiacriticsRemoval.removeDiacritics(val.toLowerCase()) : val;

    searchValue: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase,
                public popoverCtrl: PopoverController, public modalCtrl: ModalController) {
        this.categoryName = navParams.get('categoryName');
        this.list = navParams.get('list');
    }


    ngOnInit() {
        const fireAllListsPath = "/lists";
        const fireCurrentListPath = fireAllListsPath + "/" + this.list.id;
        const fireCurrentListCategoriesPath = fireCurrentListPath + "/categories";

        this.dbCategories = this.afDatabase.list(fireCurrentListCategoriesPath);
        this.categories = this.dbCategories.valueChanges();

        this.categories.subscribe(value => {console.log(value)});

        console.log("firePath: " + fireCurrentListPath);
    }


    clearSearchValue () {
        this.searchValue = null;
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
        //console.log("update item: " + JSON.stringify(item));
        this.dbCategories.update(category.id, category);
    }



    reorderCategories(indexes) {
        console.log (indexes.from + " " + indexes.to);
        let element = this.categories[indexes.from];
        console.log (element);
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



