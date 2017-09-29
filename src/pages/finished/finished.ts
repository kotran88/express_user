import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import {review } from './../../components/models/review'
import { Subscription } from 'rxjs/Subscription';

import { request } from './../../components/models/request';
/**
 * Generated class for the FinishedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-finished',
  templateUrl: 'finished.html',
})
export class FinishedPage {
  mileage:number;
  request={} as request;
  reviews={} as review;
  messengeruid:string;
  id:string;
  time:string;
  foto:string;
  uid:string;
  text:string;
  orderNo:string;
  rating:string="5";
  itemObject:any;
  reviewer:any;
  todayWithTime:any;
  name:string;
  unsubscriber: Subscription = new Subscription();
  constructor(public viewCtrl:ViewController ,public afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
  
    let today = new Date();
    let dd:number;
    let day:string;
    let month:string;
     dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
   var time=new Date().toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
   
    dd<10?day='0'+dd:day=''+dd;
    mm<10?month='0'+mm:month=''+mm;
    let todayNoTime= yyyy+" "+mm+" "+dd;
    let todayNoTime2=yyyy+'/'+month+'/'+day;
  this.todayWithTime = yyyy+'/'+month+'/'+day+' '+time;
  }

  ionViewWillEnter() {
    this.itemObject=this.navParams.get("itemObject");
    console.log(this.itemObject);
    this.foto=this.itemObject.messengerFoto;
    console.log(this.itemObject)
    this.messengeruid=this.itemObject.messengeruid;
    this.uid=this.itemObject.senderuid;
    this.orderNo=this.itemObject.orderNo;
    this.name=this.itemObject.messengerName;
    this.id=this.itemObject.deliveryGuy;
    this.reviewer=this.itemObject.user;
    if(this.uid==undefined){
      this.uid="evCJcw2WnGWlwUcFVk1K1kHVQzJ2"
    }
    
  }
  confirm(){
    this.viewCtrl.dismiss();
  }
  log(value){
    console.log(value)
    this.rating=value;
  }
  review(){
    this.reviews.reviewer=this.reviewer;
    this.reviews.created_date=this.todayWithTime;
    this.reviews.content=this.text;
    this.reviews.rating=this.rating;
    this.request=this.itemObject;
    this.request.status="finished_review";
    console.log(this.reviews);
    this.afDatabase.object('profile/'+this.messengeruid+'/finished/'+this.orderNo).set(this.reviews)
    this.request.rating=this.rating;
    this.request.rating_content=this.text;
    console.log(this.request);
    this.afDatabase.object('/requestedList/requested/'+this.orderNo).remove();
    this.afDatabase.object('/requestedList/requestedAll/'+this.orderNo).set(this.request);
      this.mileage=parseInt(this.request.distance)*1000*0.1
      console.log(this.mileage);
      console.log(this.uid);
      var getcurrentPoint=this.afDatabase.list('/profile/'+this.uid+'/point/', { preserveSnapshot: true })
       this.unsubscriber=getcurrentPoint.subscribe(snapshots=>{
           console.log("len"+snapshots.length);
        snapshots.forEach(element => {
            console.log(element.key);
            if(element.key=="value"){
               var currentPoint=element.val();
                console.log("point:"+element.val());
                this.unsubscriber.unsubscribe();
                var pointt=this.afDatabase.object('profile/'+this.uid+'/point/')
                pointt.update({
                    value:(currentPoint+this.mileage)
                }).then(()=>{
                    var pointInsert=this.afDatabase.list("profile/"+this.uid+"/point").push({created:this.todayWithTime,valueAdded:this.mileage}).then(()=>{
                   }).catch((error)=>{
                   });
                    return;
                })
            }
           })
       });
  }
  goBack(){
      this.viewCtrl.dismiss();
  }

}
