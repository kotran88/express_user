import { Profile_User } from './../../components/models/profile';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from './../home/home';

import firebase from 'firebase';
import { PhoneNumber } from './../../components/models/phonenumber';
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
  second:boolean=false;
  phone_final:any;
  windowRef:any;
  phoneNumber = new PhoneNumber()
  verificationCode: string;
  pre:any;
  line:any;
  line2:any;
   profile={} as Profile_User
  google:boolean;
  items:any;
  foto:string;
  today:string;
  result:string;
  start:boolean;
  dup:boolean=false;
  nodup:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,private afAuth : AngularFireAuth, private afDatabase : AngularFireDatabase) {
    this.start=true;
      //  this.profile.foto="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";
      //  this.profile.first=true;
  }
  dupulicate(){
    this.dup=false;
    this.nodup=false;
    this.start=false;
    this.afAuth.authState.subscribe(auth=>{
      this.items=this.afDatabase.list('profile/', { preserveSnapshot: true })
      this.items.subscribe(snapshots=>{
        snapshots.forEach(element => {
          console.log("element")

          var keysFiltered = Object.keys(element.val()).filter(function(item){return !( element.val()[item] == undefined)});
          
         var valuesFiltered = keysFiltered.map((item)=> {
             console.log(item);
             console.log(element.val()[item]);
             if(item=="id"){
               alert(item+","+element.val()[item]);
              if(element.val()[item]==this.profile.id){
                this.result="중복된아이디입니다";
                this.dup=true;
              }else{
                this.nodup=true;
                this.result="사용가능"
              }
             }
             
          
         });
         alert(this.dup+","+this.nodup);
        

        });
      })

    })
  }
  ngOnInit(){
    this.windowRef=window;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    if(this.second){

    }else{

      this.windowRef.RecaptchaVerifier= new firebase.auth.RecaptchaVerifier('sign-in-button')
      this.windowRef.RecaptchaVerifier.render()
      alert("rendered")
    }
  }
  verifyLoginCode(){
    this.windowRef.confirmationResult.confirm(this.verificationCode).then(result=>{
      console.log("result success");
      console.log(result);
      console.log(result.user);
    })
  }
  checkPhone(){
    const appVerifier=this.windowRef.RecaptchaVerifier;
    this.phoneNumber.country="82"
    this.phoneNumber.area=this.pre
    this.phoneNumber.prefix=this.line
    this.phoneNumber.line=this.line2
    this.phone_final=this.pre+"-"+this.line+"-"+this.line2;
    const num=this.phoneNumber.e164;
    const re=firebase.auth().signInWithPhoneNumber(num,appVerifier).then(result=>{
      console.log(result);
      this.windowRef.confirmationResult=result;
    }).catch(error=>{
      alert("error : "+error);
    })
    console.log("rrr");
  }
  createProfile(){
    this.second=true;
    this.profile.first=true;
    this.afAuth.authState.subscribe(auth=>{
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
      let todayWithTime = yyyy+'/'+month+'/'+day+' '+time;
      if(this.phone_final==undefined||this.phone_final==""){
        this.phone_final="010-7999-8598"
      }
      this.profile.phone=this.phone_final;
      this.profile.name="고객";
      this.profile.created_date=todayWithTime
      this.profile.foto=localStorage.getItem("foto");
      localStorage.setItem("firstLogin","false");
      this.afDatabase.object('profile/'+auth.uid+'/').set(this.profile)
    })
  }
}
