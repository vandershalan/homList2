import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Observable} from "rxjs/Observable";

/**
 * Generated class for the ListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'item-list',
    templateUrl: 'item.html',
})
export class ItemPage {

    item: any;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.item = navParams.data;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ListPage');
    }

}
