import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams } from 'ionic-angular';
import { HomePage } from './../home/home';
import { ChatPage } from './../chat/chat';
/**
 * Generated class for the ViewRequestListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-view-request-list',
  templateUrl: 'view-request-list.html',
})
export class ViewRequestListPage {
  items:any;
  userId:string;
  shown:any;
  result=[];
 
  result_date=[];
  constructor(public navCtrl: NavController,public viewCtrl:ViewController ,public navParams: NavParams,public afd:AngularFireDatabase) {
    var id=localStorage.getItem("id");
    if(id!=undefined||id!=null){
    this.userId=id;
    }else{
    this.userId="admin"
    }
    
   this.items=this.afd.list('/requestedList/requestedAll', { preserveSnapshot: true })
     console.log("snapshot????????????????????????????")
     console.log(this.items);
    this.items.subscribe(snapshots=>{
     console.log(snapshots);
  
     snapshots.forEach(element => {
       console.log("key value");
       console.log(element.key);
         console.log(element.val());
        var keysFiltered = Object.keys(element.val()).filter(function(item){return !( element.val()[item] == undefined)});
   
  var valuesFiltered = keysFiltered.map((item)=> {
    if(element.val()[item].user==this.userId){
      console.log(item);
      console.log(element.val()[item]);
     
      this.result_date.push(element.val()[item].onlyDate)
      console.log("rrresult")
      console.log(this.result_date);
      this.result.push(element.val()[item])
        console.log(this.result);
        this.result_date=Array.from(new Set(this.result_date))
        console.log(this.result_date);
    }
   
  });
  
     })
    })
  }
  chat(itemObject){
    this.navCtrl.push(ChatPage,{item:itemObject})
  }
  goBack(){
    this.navCtrl.setRoot(HomePage)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRequestListPage');
  }

}
