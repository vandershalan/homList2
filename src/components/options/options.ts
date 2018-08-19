import {Component} from '@angular/core';
import {ViewController} from "ionic-angular";

@Component({
    selector: 'options',
    templateUrl: 'options.html'
})
export class OptionsComponent {
    showActive: boolean;
    showDone: boolean;

    constructor(public viewCtrl: ViewController) {
    }

    close() {
        this.viewCtrl.dismiss();
    }
}
