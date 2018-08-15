import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
    selector: 'new-item',
    templateUrl: 'newItem.html',
})
export class NewItemPage {

    itemName: any;
    @ViewChild('nameInput') nameInput;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.itemName = navParams.data;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NewItemPage');
        setTimeout(() => {
            this.nameInput.setFocus();
        },500);
    }

    // ngAfterViewChecked() {
    //     this.nameInput.setFocus()
    // }
}
