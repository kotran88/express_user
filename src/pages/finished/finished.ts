import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import {review } from './../../components/models/review'

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
  request={} as request;
  reviews={} as review;
  id:string;
  time:string;
  foto:string;
  uid:string;
  text:string;
  orderNo:string;
  rating:string="5";
  itemObject:any;
  constructor(public viewCtrl:ViewController ,public afDatabase: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.id = this.navParams.get('id');
    this.time=this.navParams.get("time")
    this.foto=this.navParams.get("foto")
    this.uid=this.navParams.get("uid");
    this.orderNo=this.navParams.get("orderNo")
    this.itemObject=this.navParams.get("itemObject");
    if(this.uid==undefined){
      this.uid="zUjzGdNOa8ZUAFHvQFQgKhEbEoe2"
    }
    if(this.orderNo==undefined){
      this.orderNo="2017082100000"
    }
    if(this.id==undefined||this.id==null){
      this.id="haha"
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
    this.reviews.content=this.text;
    this.reviews.rating=this.rating;
    this.request=this.itemObject;
    this.afDatabase.object('profile/'+this.uid+'/finished/'+this.orderNo).set(this.reviews)
    this.request.rating=this.rating;
    this.request
    this.afDatabase.object('/requestedList/requestedAll/'+this.itemObject.orderNo).set(this.request);

    
  }
  goBack(){
      this.viewCtrl.dismiss();
  }

}
