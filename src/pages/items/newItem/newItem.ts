import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {Item, ItemType} from "../../../model/item";
import {List} from "../../../model/list";
import {AngularFireList, AngularFireDatabase} from 'angularfire2/database';
import {Category} from "../../../model/category";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";
import {ItemsListPage} from "../itemsList/itemsList";


@IonicPage()
@Component({
    selector: 'new-item',
    templateUrl: 'newItem.html',
})
export class NewItemPage {

    itemName: string;
    description: string;
    category: Category = Category.CATEGORY_WITHOUT_CATEGORY;

    itemType: typeof ItemType = ItemType;

    @ViewChild('nameInput') nameInput;

    dbAllLists: AngularFireList<any>;
    dbCurrentItemList: AngularFireList<any>;
    dbCategories: AngularFireList<Category>;

    private categoriesSubscription: Subscription;


    constructor(public navParams: NavParams, public navCtrl: NavController, public events: Events, public afDatabase: AngularFireDatabase) {
        this.itemName = navParams.get('itemName');
        this.dbAllLists = navParams.get('dbAllLists');
        this.dbCurrentItemList = navParams.get('dbCurrentItemList');
        this.dbCategories = navParams.get('dbCategories');
    }


    ngOnInit() {
    }


    ionViewWillEnter() {
        console.log('newItem ionViewWillEnter');
        this.categoriesSubscription = this.dbCategories.valueChanges().pipe(map(ctgrs => ctgrs.find(ctgr => (ctgr.isDefault)))).subscribe(ctgr => {ctgr ? this.category = ctgr : ''});
        this.events.subscribe('selectedCategoryTopic', category => {
            this.category = category;
        });
    }


    ionViewWillLeave(): void {
        console.log('newItem ionViewWillLeave');
        this.categoriesSubscription.unsubscribe();
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
            //creating new list in db
            const newListRef = this.dbAllLists.push({});
            const newList = new List(newListRef.key, item.name);
            newListRef.set(newList);

            item.listRef = newListRef.key;

            //adding default category to new list in db
            const dbNewListCategories = this.afDatabase.list(ItemsListPage.fireAllListsPath + "/" + newListRef.key + "/categories");
            const newListCategoryRef = dbNewListCategories.push({});
            const defaultCategory = Category.CATEGORY_WITHOUT_CATEGORY;
            defaultCategory.id = newListCategoryRef.key;
            defaultCategory.isDefault = true;
            newListCategoryRef.set(defaultCategory);
        }

        //creating new item as list
        const itemRef = this.dbCurrentItemList.push({});
        item.id = itemRef.key;
        itemRef.set(item);

        this.events.publish('itemsAddedTopic');
        this.navCtrl.pop();
    }


    goToCategoriesPage() {
        this.navCtrl.push('CategoriesListPage', {showRadio: true, categoryId: this.category.id, dbCategories: this.dbCategories, dbCurrentItemList: this.dbCurrentItemList});
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad NewItemPage');
        setTimeout(() => {
            this.nameInput.setFocus();
        }, 700);
    }

}
