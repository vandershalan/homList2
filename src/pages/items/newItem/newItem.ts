import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {Item, ItemType} from "../../../model/item";
import {List} from "../../../model/list";
import {AngularFireList} from 'angularfire2/database';
import {Category} from "../../../model/category";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";


@IonicPage()
@Component({
    selector: 'new-item',
    templateUrl: 'newItem.html',
})
export class NewItemPage {

    itemName: string;
    description: string;
    category: Category = Category.WITHOUT_CATEGORY;

    itemType: typeof ItemType = ItemType;
    @ViewChild('nameInput') nameInput;

    dbAllLists: AngularFireList<any>;
    dbCurrentItemList: AngularFireList<any>;
    dbCategories: AngularFireList<Category>;

    private categoriesSubscription: Subscription;


    constructor(public navParams: NavParams, public navCtrl: NavController, public events: Events) {
        this.itemName = navParams.get('itemName');
        this.dbAllLists = navParams.get('dbAllLists');
        this.dbCurrentItemList = navParams.get('dbCurrentItemList');
        this.dbCategories = navParams.get('dbCategories');

        //this.clearSearchValueFn = navParams.get('clearSearchValueFn');

        console.log('itemName: ' + this.itemName);
    }


    ngOnInit() {
        this.categoriesSubscription = this.dbCategories.valueChanges().pipe(map(ctgrs => ctgrs.find(ctgr => (ctgr.isDefault)))).subscribe(ctgr => {ctgr ? this.category = ctgr : ''});
    }


    ionViewWillEnter() {
        console.log('newItem ionViewWillEnter');
        this.events.subscribe('selectedCategoryTopic', category => {
            console.log(category.name, category);
            this.category = category;
        });

    }


    ionViewWillLeave(): void {
        console.log('newItem ionViewWillLeave');
        this.events.unsubscribe('selectedCategoryTopic', () => {
            console.log('Unsubscribed selectedCategoryTopic');
        });
    }


    addItem(itemType: ItemType) {

        const item = new Item(this.itemName, this.description, itemType);

        if (this.category) {
            item.categoryId = this.category.id;
        }

        if (item.type === ItemType.List) {
            const listRef = this.dbAllLists.push({});
            listRef.set(new List(listRef.key, item.name));
            item.listRef = listRef.key;
        }

        const itemRef = this.dbCurrentItemList.push({});
        item.id = itemRef.key;
        itemRef.set(item);

        this.events.publish('itemsAddedTopic');
        this.navCtrl.pop();
    }


    goToCategoriesPage() {
        this.navCtrl.push('CategoriesListPage', {categoryId: this.category.id, dbCategories: this.dbCategories, dbCurrentItemList: this.dbCurrentItemList});
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad NewItemPage');
        setTimeout(() => {
            this.nameInput.setFocus();
        }, 700);
    }

}
