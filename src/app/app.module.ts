import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {NewItemPage} from '../pages/newItem/newItem';
import {OptionsComponent} from "../components/options/options";
// Import the AF2 Module
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
// import {ListOptions} from "../model/listOptions";
import {FilterPipe} from "../pipes/filter/filter";
import {SortPipe} from "../pipes/sort/sort";
import {OrderModule} from "ngx-order-pipe";
import {FilterPipeModule} from "ngx-filter-pipe";

// AF2 Settings
export const firebaseConfig = {
    apiKey: "AIzaSyAbgLEXCtwDTIrAMeYP54ovupW7eI_rvu8",
    authDomain: "homorg-hom-list.firebaseapp.com",
    databaseURL: "https://homorg-hom-list.firebaseio.com",
    projectId: "homorg-hom-list",
    storageBucket: "homorg-hom-list.appspot.com",
    messagingSenderId: "797168590106"
};

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        NewItemPage,
        OptionsComponent,
        FilterPipe,
        SortPipe
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        OrderModule,
        FilterPipeModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        NewItemPage,
        OptionsComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
