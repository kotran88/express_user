import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

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
  id:string;
  time:string;
  foto:string;
  text:string;
  constructor(public viewCtrl:ViewController , public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.id = this.navParams.get('id');
    this.time=this.navParams.get("time")
    this.foto=this.navParams.get("foto")
    if(this.id==undefined||this.id==null){
      this.id="haha"
    }
  }
  confirm(){
    this.viewCtrl.dismiss();
  }
  log(value){
    console.log(value)
  }
  review(){
    alert(this.text)
  }
  goBack(){
      this.viewCtrl.dismiss();
  }

}
