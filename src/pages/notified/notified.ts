import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController,public viewCtrl:ViewController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.id = this.navParams.get('id');
    this.time=this.navParams.get("time")
    this.distance=this.navParams.get("distance")
    this.foto=this.navParams.get("foto")
    if(this.id==undefined||this.id==null){
      this.id="test Id "
    }
  }
  confirm(){
    this.viewCtrl.dismiss();
  }
  log(value){
    console.log(value)
  }
  goBack(){
      this.viewCtrl.dismiss();
  }

}
