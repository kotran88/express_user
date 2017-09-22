import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams } from 'ionic-angular';
import { HomePage } from './../home/home';
import { ChatPage } from './../chat/chat';
import { request } from './../../components/models/request';
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
  order:any;
  rmodel:any;
  dateA:any;
  dateB:any;
  items:any;
  userId:string;
  viewSetting:any;
  shown:any;
  result=[];
  request={} as request
  result_date=[];

  result_pick=[];
  result_date_pick=[];
  constructor(public afDatabase: AngularFireDatabase, public navCtrl: NavController,public viewCtrl:ViewController ,public navParams: NavParams,public afd:AngularFireDatabase) {
    var id=localStorage.getItem("id");
    if(id!=undefined||id!=null){
    this.userId=id;
    }else{
    this.userId="admin"
    }
    this.order="new";
   this.getList("new");
  }

  getList(value){
    this.result_date=[];
    this.result=[];
    this.items=this.afd.list('/requestedList/requestedAll', { preserveSnapshot: true })
    this.items.subscribe(snapshots=>{
   
        
     snapshots.forEach(element => {
         if(element.val().user==this.userId){
          this.result_date.push(element.val().onlyDate);
          this.result.push(element.val());
          this.result_date=Array.from(new Set(this.result_date))
        }
     })
     console.log("date!!")
     console.log(this.result_date);
     

     console.log(this.result_date)
    })
    if(value=="old"){
      this.result_date.sort(function(a,b){
        let dateA = +new Date(a);
         let dateB = +new Date(b);
       console.log(dateA);
       console.log(dateB);
        return dateA-dateB;
      })
    }else if(value=="new"){
      this.result_date.sort(function(a,b){
        let dateA = +new Date(a);
         let dateB = +new Date(b);
       console.log(dateA);
       console.log(dateB);
        return dateB-dateA;
      })
    }
  }
  orderchanged(){
    if(this.order!=undefined){

      this.getList(this.order);
    }
  }
  viewPickup(){
   this.sorting("pickup");
  }
  viewRequested(){
    this.sorting("requested");
  }
  viewAssigned(){
    this.sorting("assigned");
  }
  viewFinished(){
    this.sorting("finished")
  }
  changed2(){
    switch (this.rmodel) {
      case "pickup":
        this.sorting("pickup")
        break;
      case "requested":
        this.sorting("requested");
        break;
      case "assigned":
        this.sorting("assigned");
        break;
      case "finished":
       this.sorting("finished")
       break;
      default:
        break;
    }
  }
  sorting(value){
    this.result_date=[];
    this.result=[];
    var items=this.afd.list('/requestedList/requestedAll', { preserveSnapshot: true })
    console.log("snapshot????????????????????????????")
   items.subscribe(snapshots=>{
    console.log(snapshots);
 
    snapshots.forEach(element => {
      console.log("key value");
      console.log(element.key);
        console.log(element.val());
        console.log(element.val().user+",,,"+this.userId);
        if(element.val().user==this.userId&&element.val().status==value){
         this.result_date.push(element.val().onlyDate);
         this.result.push(element.val());
         this.result_date=Array.from(new Set(this.result_date))
       }
    })
   })
  }
  chat(itemObject){
    console.log(itemObject);
    this.navCtrl.push(ChatPage,{item:itemObject})
  }
  confirm(itemObject){
    this.request=itemObject;
    this.request.status="finished";
    this.afDatabase.object('/requestedList/assigned/'+itemObject.orderNo).remove();
    this.afDatabase.object('/requestedList/finished/'+itemObject.orderNo).set(this.request);
    this.afDatabase.object('/requestedList/requestedAll/'+itemObject.orderNo).set(this.request);
  }
  goBack(){
    this.navCtrl.setRoot(HomePage)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRequestListPage');
  }

}
