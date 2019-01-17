import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
// Import the AF2 Module
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {OrderModule} from "ngx-order-pipe";

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
        MyApp
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        OrderModule
    ],
    bootstrap: [
        IonicApp
    ],
    entryComponents: [
        MyApp
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
