import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams,public afd:AngularFireDatabase) {
    this.items=this.afd.list('profile/zNwZNIwW4MeOfiqskhxfY15imwn2/request')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRequestListPage');
  }

}
