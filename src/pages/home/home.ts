import { Component } from '@angular/core';
import {NavController, AlertController, ActionSheetController, NavParams} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';
import { Observable } from "rxjs/Observable";
import { ItemPage } from "../item/item"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    itemsList: AngularFireList<any>;
    items: Observable<any[]>;
    item: any

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase, public actionSheetCtrl: ActionSheetController) {
        this.item = navParams.data;
        const itemId = this.item.id;
        const firePath = "/items/" + itemId + "/items";
        this.itemsList = afDatabase.list(firePath);
        this.items = this.itemsList.valueChanges();
        console.log("firePath: " + firePath);
        }


    addList(){
        let prompt = this.alertCtrl.create({
            title: 'Item Name',
            message: "Enter a name for this new item",
            inputs: [
              {
                name: 'name',
                placeholder: 'Name'
              },
            ],
            buttons: [
              {
                text: 'Cancel',
                handler: data => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Save',
                handler: data => {
                  const newListRef = this.itemsList.push({});

                  newListRef.set({
                    id: newListRef.key,
                    name: data.name
                  });
                }
              }
            ]
          });
          prompt.present();
    }


    showOptions(listId, listName) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'What do you want to do with: ' + listName + '?',
        buttons: [
          {
            text: 'Delete List',
            role: 'destructive',
            handler: () => {
              this.removeList(listId);
            }
          },{
            text: 'Update name',
            handler: () => {
              this.updateList(listId, listName);
            }
          },{
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }


    removeList(listId: string){
        this.itemsList.remove(listId);
    }


    updateList(listId, listName){
      let prompt = this.alertCtrl.create({
        title: 'List Name',
        message: "Update the name for this list",
        inputs: [
          {
            name: 'name',
            placeholder: 'Name',
            value: listName
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              this.itemsList.update(listId, {
                name: data.name
              });
            }
          }
        ]
      });
      prompt.present();
    }

    goToListPage(item) {
      this.navCtrl.push(HomePage, item);
    }

    executed(item) {
        console.log("Item name: " + item.name);
    }}
