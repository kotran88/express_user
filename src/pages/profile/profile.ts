import { Profile_User } from './../../components/models/profile';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from './../home/home';
/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
   profile={} as Profile_User
  google:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams,private afAuth : AngularFireAuth, private afDatabase : AngularFireDatabase) {
     this.google=navParams.get("google"); 
     if(this.google==true){
      this.profile.google=true;
    }else{
      this.profile.google=false;
       this.profile.foto="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  createProfile(){
    this.afAuth.authState.subscribe(auth=>{
      this.afDatabase.object('profile/'+auth.uid).set(this.profile)
      .then(() => this.navCtrl.setRoot(HomePage)).catch((error)=> console.log("err : "+error))
    })
  }
}
