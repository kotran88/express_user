import { Profile_User } from './../../components/models/profile';
import { AngularFireDatabase } from 'angularfire2/database';
import { PhoneNumber } from './../../components/models/phonenumber';
import { ProfilePage } from './../../pages/profile/profile';
import { User } from './../../components/models/user';
import { SignupPage } from './../signup/signup';
import { HomePage } from './../../pages/home/home';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule} from 'angularfire2';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';



/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {
  windowRef:any;
  profile={} as Profile_User;
  user={} as User;
  items : any;
  phoneNumber = new PhoneNumber()
  checked:boolean=false;
  verificationCode: string;

  users: any;
    requestToken:any;
  constructor(public toast:ToastController, public afAuth : AngularFireAuth,public afDatabase:AngularFireDatabase, public navCtrl: NavController,public googleplus:GooglePlus,public afauth:AngularFireAuth,public afd:AngularFireDatabase) {
  
   

  }
  KakaoLogin(){
    // var browserRef = window.open('https://kauth.kakao.com/oauth/authorize?client_id=' + '803c650d8d5a94925867774666d3e0b7' + '&redirect_uri=http://localhost/&response_type=code', '_blank', 'location=no');
    // window.setTimeout(function(){
    //   browserRef.addEventListener('loadstart', function(event:InAppBrowserEvent) {
    //       console.log('in loadstart ');
    //       alert('start: ' + event.url);
    //   });
    // }, 1000);
   
    //   browserRef.addEventListener("exit", function(event) {
    //         alert("The Facebook sign in flow was canceled");
    //     });
  }
  ngOnInit(){
    //   var ref = this.afd.database.ref("profile");
    //     firebase.database().ref().on('value', function(snapshot) {
    //         // Do whatever
    //     });
    //  this.windowRef=window;
    // this.windowRef.RecaptchaVerifier= new firebase.auth.RecaptchaVerifier('sign-in-button')
    // this.windowRef.RecaptchaVerifier.render()
  }
  get windowR(){
    return window;
  }
  verifyLoginCode(){
    this.windowRef.confirmationResult.confirm(this.verificationCode).then(result=>{
      console.log("result success");
      console.log(result);
      console.log(result.user);
    })
  }
  signup(){
    // this.navCtrl.push(SignupPage);
    // const appVerifier=this.windowRef.RecaptchaVerifier;
    // this.phoneNumber.country="82"
    // this.phoneNumber.area="010"
    // this.phoneNumber.prefix="7999"
    // this.phoneNumber.line="8598"
    // const num=this.phoneNumber.e164;
    // const re=firebase.auth().signInWithPhoneNumber(num,appVerifier).then(result=>{
    //   console.log(result);
    //   this.windowRef.confirmationResult=result;
    // }).catch(error=>{
    //   alert("error : "+error);
    // })
    // console.log("rrr");
    this.navCtrl.push(SignupPage);
  }
    async login(user:User){
    try{
      const result=await this.afauth.auth.signInWithEmailAndPassword(user.email,user.password)
      console.log(result);
      if(result){
        this.navCtrl.setRoot(HomePage)

      }else{
        console.log(result.message);
      }
    }catch(e){
      alert("no user found")
    }
    }
  googleLogin(){

    
    this.googleplus.login({
      'webClientId':'916589339698-n71c3mmpsclus88rk6fp99la7sh0vnga.apps.googleusercontent.com'
    }).then((res)=>{
      firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken)).then(
        suc=>{

          this.afAuth.authState.subscribe(auth=>{
            var count=0;
            localStorage.setItem("id", res.email.split("@")[0]);
            localStorage.setItem("foto",res.imageUrl);
            this.items=this.afDatabase.list('profile/'+auth.uid, { preserveSnapshot: true })
            this.items.subscribe(snapshots=>{
              if(snapshots.length==0){
                this.profile.first=false;
                this.profile.id="null";
                this.profile.created_date="null";
                this.profile.foto="null";
                this.afDatabase.object('profile/'+auth.uid+'/').set(this.profile)
                .then(() => {  this.navCtrl.setRoot(ProfilePage);   } ).catch((error)=> alert("err : "+error))
              }else{
                if(snapshots.forEach(element=>{
                  if(element.key=="first"){
                    count++;
                    if(element.val()==true){

                      if(count==1){
                        let toast = this.toast.create({
                          message: '로그인되었습니다.',
                          duration: 1000,
                          position: 'middle'
                        });
                      
                        toast.onDidDismiss(() => {
                          this.navCtrl.setRoot(HomePage);
                        });
                      
                        toast.present();
                        
                      }
                    }else{
                      if(count==1){

                        this.navCtrl.setRoot(ProfilePage);
                      }else{
                        alert("goto home")
                        this.navCtrl.setRoot(HomePage)
                      }
                    }
                    
                  }
                }))
                if(this.checked){
                 
                  
                }else{
                
                }
                
              }
          })
            
            
          })
          
          
        }).catch(ns=>{
          alert("fail"+ns);
        })
    }).catch((error =>{
      alert(error);
    }))
  }

  
}
