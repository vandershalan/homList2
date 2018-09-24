import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";
import {ListOptions} from "../../model/listOptions";

@Component({
    selector: 'options',
    templateUrl: 'options.html'
})
export class OptionsComponent {

    listOptions: ListOptions;
    currentSortField: string;

    constructor(public viewCtrl: ViewController, public navParams: NavParams) {
        this.listOptions = navParams.get("listOptions");
        this.currentSortField = this.listOptions.column;
    }


    sortChanged() {
        if (this.listOptions.column === this.currentSortField) {
            this.listOptions.descending = !this.listOptions.descending;
        } else {
            this.listOptions.descending = false;
            this.listOptions.column = this.currentSortField;
        }
        console.log(this.listOptions.column);
        console.log(this.listOptions.descending);
        this.close();
    }

    close() {
        this.viewCtrl.dismiss({listOptions: this.listOptions});
    }

    onDidDismiss() {

    }
}
