import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {Item, ItemType} from "../models/item";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = 'ItemsListPage';
    rootPageParams: any;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });

        const item: Item = new Item("homorgList", "Root list", ItemType.List);
        item.listRef = "ROOT";
        item.id = "ROOT";

        this.rootPageParams = item;
    }
}

