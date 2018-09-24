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
        this.currentSortField = this.listOptions.sortField;
    }


    sortChanged() {
        if (this.listOptions.sortField === this.currentSortField) {
            this.listOptions.sortDesc = !this.listOptions.sortDesc;
        } else {
            this.listOptions.sortDesc = false;
            this.listOptions.sortField = this.currentSortField;
        }
        this.close();
    }


    close() {
        this.viewCtrl.dismiss({listOptions: this.listOptions});
    }
}
