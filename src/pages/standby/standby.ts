import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { HomePage} from './../home/home'
/**
 * Generated class for the StandbyPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-standby',
  templateUrl: 'standby.html',
})
export class StandbyPage {
  items:any;
  location=[];
  numberofemployees:number=0;
  pickuplocation:any;
  pickuplat:any;
  pickuplng:any;

  constructor(private afDatabase:AngularFireDatabase,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.pickuplocation=this.navParams.get('pickuplocation');
    this.pickuplat=this.navParams.get('pickuplat');
    this.pickuplng=this.navParams.get('pickuplng');
    
    this.items = this.afDatabase.list('/employees_status/Available/', { preserveSnapshot: true });
    this.items.subscribe(snapshots=>{
        snapshots.forEach(element => {
          console.log(element.key);
          console.log(element.val());
          var location_each=new google.maps.LatLng(element.val().lat,element.val().lng)
          this.location.push(location_each);
        })

        console.log(this.location);
        console.log(this.location.length)
        for(var i=0; i<this.location.length;i++){
          console.log(i);
          console.log(this.location[i].lat()+"!"+this.location[i].lng())
          console.log(this.pickuplat+"!"+this.pickuplng);
         var showndistance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.location[i].lat(),this.location[i].lng()),
         new google.maps.LatLng(this.pickuplat,this.pickuplng));  
         showndistance=showndistance/1000
         if(showndistance<3000){
           this.numberofemployees++;
         }
         console.log(i+"번째 : "+showndistance);
        } 
      })
      console.log('Hello standby Provider');
      
      
    

  }
  gotomain(){
    this.navCtrl.setRoot(HomePage);
  }
}
