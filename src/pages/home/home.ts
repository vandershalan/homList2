import { Component } from '@angular/core';
import { NavController, AlertController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from "rxjs/Observable";
import { ListPage } from "../list/list"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    listsList: AngularFireList<any>;
    lists: Observable<any[]>;

    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public afDatabase: AngularFireDatabase, public actionSheetCtrl: ActionSheetController) {
        this.listsList = afDatabase.list('/lists');
        this.lists = this.listsList.valueChanges();
    }


    addList(){
        let prompt = this.alertCtrl.create({
            title: 'List Name',
            message: "Enter a name for this new list",
            inputs: [
              {
                name: 'title',
                placeholder: 'Title'
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
                  const newListRef = this.listsList.push({});

                  newListRef.set({
                    id: newListRef.key,
                    title: data.title
                  });
                }
              }
            ]
          });
          prompt.present();
    }


    showOptions(listId, listTitle) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'What do you want to do with: ' + listTitle + '?',
        buttons: [
          {
            text: 'Delete List',
            role: 'destructive',
            handler: () => {
              this.removeList(listId);
            }
          },{
            text: 'Update title',
            handler: () => {
              this.updateList(listId, listTitle);
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
        this.listsList.remove(listId);
    }


    updateList(listId, listTitle){
      let prompt = this.alertCtrl.create({
        title: 'List Name',
        message: "Update the name for this list",
        inputs: [
          {
            name: 'title',
            placeholder: 'Title',
            value: listTitle
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
              this.listsList.update(listId, {
                title: data.title
              });
            }
          }
        ]
      });
      prompt.present();
    }

    goToListPage(list) {
      this.navCtrl.push(ListPage, list);
    }
}
