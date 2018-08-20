import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";

@Component({
    selector: 'options',
    templateUrl: 'options.html'
})
export class OptionsComponent {

    showActive: boolean;
    showDone: boolean;

    constructor(public viewCtrl: ViewController, public navParams: NavParams) {
        this.showActive = navParams.get("showActive");
        this.showDone = navParams.get("showDone");
    }

    close() {
        this.viewCtrl.dismiss({showActive: this.showActive, showDone: this.showDone});
    }

    onDidDismiss() {

    }
}
