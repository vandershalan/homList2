import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {AngularFireList} from 'angularfire2/database';
import {Category} from "../../../models/category";
import {ItemWithCategory} from "../../../models/itemWithCategory";


@IonicPage()
@Component({
    selector: 'edit-item',
    templateUrl: 'editItem.html',
})
export class EditItemPage {

    itemWC: ItemWithCategory;

    @ViewChild('nameInput') nameInput;

    dbAllLists: AngularFireList<any>;
    dbCurrentItemList: AngularFireList<any>;
    dbCategories: AngularFireList<Category>;


    constructor(public navParams: NavParams, public navCtrl: NavController, public events: Events) {
        this.itemWC = navParams.get('itemWithCategory');
        this.dbAllLists = navParams.get('dbAllLists');
        this.dbCurrentItemList = navParams.get('dbCurrentItemList');
        this.dbCategories = navParams.get('dbCategories');
        // console.log('itemName: ' + this.itemWC.item.name);
    }


    ionViewWillEnter() {
        console.log('editItem ionViewWillEnter');
        this.events.subscribe('selectedCategoryTopic', category => {
            console.log(category.name, category);
            this.itemWC.item.categoryId = category.id;
            this.itemWC.category = category;
        });
    }


    ionViewWillLeave(): void {
        console.log('editItem ionViewWillLeave');
        this.events.unsubscribe('selectedCategoryTopic', () => {
            console.log('Unsubscribed selectedCategoryTopic');
        });
    }


    updateItem() {
        this.dbCurrentItemList.update(this.itemWC.item.id, this.itemWC.item);

        // this.events.publish('itemsAddedTopic');
        this.navCtrl.pop();
    }


    goToCategoriesPage() {
        this.navCtrl.push('CategoriesListPage', {showRadio: true, categoryId: this.itemWC.item.categoryId, dbCategories: this.dbCategories, dbCurrentItemList: this.dbCurrentItemList});
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad EditItemPage');
        setTimeout(() => {
            this.nameInput.setFocus();
        }, 700);
    }

}
