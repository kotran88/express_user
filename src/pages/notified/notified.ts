import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ChatPage } from './../chat/chat';
/**
 * Generated class for the NotifiedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-notified',
  templateUrl: 'notified.html',
})
export class NotifiedPage {
  id:any;
  time:any;
  distance:any;
  foto:any;
  itemObject:any;
  name:any;
  constructor(public navCtrl: NavController,public viewCtrl:ViewController, public navParams: NavParams) {
    alert("!")
  }

  ionViewWillEnter() {
    this.id = this.navParams.get('id');
    this.time=this.navParams.get("time")
    this.distance=this.navParams.get("distance")
    this.foto=this.navParams.get("foto")
    this.itemObject=this.navParams.get("itemObject")
    this.name=this.navParams.get("name");
    alert(this.name+","+this.id+""+this.distance)
  }
  confirm(){
    this.viewCtrl.dismiss();
  }
  log(value){
    console.log(value)
  }
  chat(){
    // alert(this.itemObject.orderNo);
    // this.navCtrl.push(ChatPage,{item:this.itemObject})
  }
  // goBack(){
  //     this.viewCtrl.dismiss();
  // }

}
