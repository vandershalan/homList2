import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {ListOptions} from "../../model/listOptions";

@Component({
    selector: 'options',
    templateUrl: 'options.html'
})
export class OptionsComponent {

    listOptions: ListOptions;

    constructor(public viewCtrl: ViewController, public navParams: NavParams) {
        this.listOptions = navParams.get("listOptions");
    }

    close() {
        this.viewCtrl.dismiss({listOptions: this.listOptions});
    }

    onDidDismiss() {

    }
}
