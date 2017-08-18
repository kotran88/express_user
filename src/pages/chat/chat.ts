import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  deliveryGuy:string;
  items:any;
  image:any;
  constructor(public afDatabase : AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    var item=this.navParams.get("item");
    this.deliveryGuy=item.user;

    alert(item.user)
    this.deliveryGuy="kotran"
    this.items=this.afDatabase.list('profile/', { preserveSnapshot: true })
    this.items.subscribe(snapshots=>{
      snapshots.forEach(element => {
        console.log("element")

        var keysFiltered = Object.keys(element.val()).filter(function(item){return !( element.val()[item] == undefined)});
        
       var valuesFiltered = keysFiltered.map((item)=> {
           console.log(item);
           console.log(element.val()[item]);
           if(item=="id"){
             alert(item+","+element.val()[item]);
            if(element.val()[item]==this.deliveryGuy){
              this.image=element.val()["foto"]
            }else{
              
            }
           }
           
        
       });
      

      });
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

}
