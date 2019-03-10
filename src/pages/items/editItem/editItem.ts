import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {Item, ItemType} from "../../../model/item";
import {List} from "../../../model/list";
import {AngularFireList} from 'angularfire2/database';
import {Category} from "../../../model/category";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";
import {ItemWithCategory} from "../../../model/itemWithCategory";


@IonicPage()
@Component({
    selector: 'edit-item',
    templateUrl: 'editItem.html',
})
export class EditItemPage {

    itemWC: ItemWithCategory;

    itemType: typeof ItemType = ItemType;
    @ViewChild('nameInput') nameInput;

    dbAllLists: AngularFireList<any>;
    dbCurrentItemList: AngularFireList<any>;
    dbCategories: AngularFireList<Category>;

    private categoriesSubscription: Subscription;


    constructor(public navParams: NavParams, public navCtrl: NavController, public events: Events) {
        this.itemWC = navParams.get('itemWithCategory');
        this.dbAllLists = navParams.get('dbAllLists');
        this.dbCurrentItemList = navParams.get('dbCurrentItemList');
        this.dbCategories = navParams.get('dbCategories');

        //this.clearSearchValueFn = navParams.get('clearSearchValueFn');

        console.log('itemName: ' + this.itemWC.item.name);
    }


    ngOnInit() {
        //this.categoriesSubscription = this.dbCategories.valueChanges().pipe(map(ctgrs => ctgrs.find(ctgr => (ctgr.isDefault)))).subscribe(ctgr => {ctgr ? this.itemWC = ctgr : ''});
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
