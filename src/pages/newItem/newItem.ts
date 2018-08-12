import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
    selector: 'new-item',
    templateUrl: 'newItem.html',
})
export class NewItemPage {

    itemName: any;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.itemName = navParams.data;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NewItemPage');
    }

}
