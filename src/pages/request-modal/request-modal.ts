import { Component,OnInit } from '@angular/core';
import { IonicPage, AlertController,NavController, NavParams ,Platform,ViewController,ModalController} from 'ionic-angular';
import { request } from './../../components/models/request';
import { AngularFireDatabase } from 'angularfire2/database';
import {StandbyPage } from './../standby/standby';
import { Subscription } from 'rxjs/Subscription';
import { DatePicker } from '@ionic-native/date-picker';

/**
 * Generated class for the RequestModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-request-modal',
  templateUrl: 'request-modal.html',
})
export class RequestModalPage implements OnInit {
  couponkey:string;
  coupon_flag:string;
  couponvalue:string=""
  pointtouse:number=0;
  pointAll:any;
  tounsubscribe:Subscription = new Subscription();
  unsubscriber: Subscription = new Subscription();
  checked:any;
  app_payment:boolean=false;
  final_price:number;
  coupon:boolean=true;
  start_detail:any;
  end_detail:any;
  cellphone:any;
  info:boolean=true;
  time:boolean=true;
  freight:boolean=true;
  mileage:any;
  discount_price:any;
  discount:boolean=true;
  payment:boolean=false;
  flag_payment_mean:boolean=false;
  flag_payment_info:boolean=false;
  viewStyle_animal:boolean=true;
  viewStyle_normal:boolean=false;
  viewStyle_heavy:boolean=true;
  desiredTime:string;
  start:string;
  end:string;
  favorite_list:any;
  img_forward:string;
  img_backward:string;
  content:string;
  weight:string;
  size:string;
  type:string="normal";
  request={} as request
  distance:number;
  location:any;
  it:any;
  totalNumber:any;
  request_text:string;
  userId:string;
  orderNo:string;
  todayWithTime:string;
  todayNoTime:string;
  todate:string;
  price:any;
  endDetail:string;
  startDetail:string;
  uid:string;
  point:number;
  phone:string;
  constructor(private datePicker: DatePicker,public alertCtrl:AlertController,public viewCtrl:ViewController ,public modalCtrl:ModalController,public navCtrl: NavController,public platform:Platform,public afDatabase:AngularFireDatabase, public navParams: NavParams) {
    this.desiredTime="ASAP"
    let today = new Date();
    let dd:number;
    let day:string;
    let month:string;
     dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    this.price=this.navParams.get("price");
    this.final_price=this.price
    this.endDetail=this.navParams.get("endDetail");
    this.startDetail=this.navParams.get("startDetail");
    this.uid=this.navParams.get("uid");
    this.phone=this.navParams.get("phone");
    this.cellphone=this.phone;
    console.log(this.startDetail);
    var yyyy = today.getFullYear();
   var time=new Date().toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
   this.mileage=this.price*0.1;
    dd<10?day='0'+dd:day=''+dd;
    mm<10?month='0'+mm:month=''+mm;
     this.todayNoTime=yyyy+'/'+month+'/'+day;
  this.todayWithTime = yyyy+'/'+month+'/'+day+' '+time;
    this.totalNumber=this.navParams.get("totalNumber");
    this.start=this.navParams.get("start");
    this.end=this.navParams.get("end");
    this.distance=this.navParams.get("dis");
    console.log(this.distance);
    console.log("distance")
    this.distance=this.distance/1000;
    this.location=this.navParams.get("location");
    console.log(this.location);
    this.favorite_list=this.navParams.get("favorite_list")
    console.log(this.favorite_list);
    var id=localStorage.getItem("id");
    if(id!=undefined||id!=null){
    this.userId=id;
    }else{
    this.userId="admin"
    }
    this.todate=yyyy+month+day+'0000';
   
    if(this.img_forward==undefined){
      this.img_forward="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";
      this.img_backward="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";
    }

  }
  pointChecked(){
    console.log(this.pointAll);
    if(this.pointAll){
      this.pointtouse=this.point;
    }else{
      this.pointtouse=0;
    }
  }
  favorite(){
    //즐겨찾기에서 목록으로 가져오며, 상세주소를 설정해서 저장할수 있다. 
    //저장한 상세주소까지 불러올수 있도록 만든다.
    var list=[];
    for(var i=0; i<this.favorite_list.length; i++){
      list.push({type:'radio',label:this.favorite_list[i].title,value:i})
    }
    if(this.favorite_list.length==0){

    }else{
      let prompt = this.alertCtrl.create({
        title: '즐겨찾기',
        message: '즐겨찾기한 주소중 고를 수 있습니다. ',
        inputs : list,
        buttons : [
         {
           text: "취소",
           handler: data => {
             console.log("cancel clicked");
           }
         },
         {
           text: "다음",
           handler: data => {
             console.log("search clicked");
             console.log(data);
             console.log(this.favorite_list[data])
             var favorite=this.favorite_list[data];
             this.start=favorite.startPoint;
             this.end=favorite.endPoint;
             this.startDetail=favorite.startDetail;
             this.endDetail=favorite.endDetail;
             this.location.startlat=favorite.startLat;
             this.location.startlng=favorite.startLng;
             this.location.endlat=favorite.endLat;
             this.location.endlng=favorite.endLng;
           }
         }
        ]
        });
            prompt.present();
    }
    console.log(list)



  }

  ngOnInit(){
    var currentPoint=0;
    var getcurrentPoint=this.afDatabase.list('/profile/'+this.uid+'/point/', { preserveSnapshot: true })
    this.unsubscriber=getcurrentPoint.subscribe(snapshots=>{
      snapshots.forEach(element=>{
        if(element.key=="value"){
          this.point=element.val();
        }

      })
    })
  }
  selectedValue(value){
    console.log(value);
    this.type=value;
    
    if(value=="normal"){
      this.viewStyle_normal=!this.viewStyle_normal;
      console.log(this.viewStyle_normal)
      this.viewStyle_heavy=true;
      this.viewStyle_animal=true;
    }
    if(value=="heavy"){
      this.viewStyle_heavy=!this.viewStyle_heavy;
      this.viewStyle_animal=true;
      this.viewStyle_normal=true;
    }
  }
  timeChanged(){
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => alert('Got date: '+ date),
      err => console.log('Error occurred while getting date: ', err)
    );
    console.log(this.desiredTime);


  }
  forward_clicked(){
    this.type="animal";
  }
  backward_clicked(){
    this.type="non-animal";
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestModalPage');
  }
  usePoint(){
    console.log(this.pointtouse);
    console.log(this.final_price);

  }
  confirm(){
    console.log(this.checked);
    if(this.checked){
      this.orderNo=this.todate+this.totalNumber
      if(this.request_text==undefined){
        this.request_text="none"
      }
      this.request.distance=this.distance+"";
      this.request.endLat=this.location.endlat;
      this.request.endLng=this.location.endlng;
      this.request.startLat=this.location.startlat;
      this.request.startLng=this.location.startlng;

      this.request.user=this.userId;
      this.request.create_date=this.todayWithTime;
      this.request.status="requested";
      this.request.startPoint=this.start;
      this.request.endPoint=this.end;
      this.request.onlyDate=this.todayNoTime;
      
      this.request.type=this.type;
      this.request.desired_time=this.desiredTime;
      this.request.request_text=this.request_text;
      this.request.orderNo=this.orderNo;
      this.request.startDetail=this.startDetail;
      this.request.endDetail=this.endDetail;
      this.request.senderuid=this.uid;
      this.request.phone=this.cellphone;
      
      //쿠폰/ 포인트를 소모할경우 - 처리한다.
      var currentPoint=0;
      if(this.couponvalue!=""){
       var couponuse=this.afDatabase.object('coupon/'+this.couponkey)
       couponuse.update({
         flag:"unavailable",
         used_date:"2017/01/01"
       }).then(()=>{
         this.final_price=0;
          }).catch((error)=>{
          });
      }
      if(this.pointtouse!=0){
       var getcurrentPoint=this.afDatabase.list('/profile/'+this.uid+'/point/', { preserveSnapshot: true })
       this.unsubscriber=getcurrentPoint.subscribe(snapshots=>{
           console.log("len"+snapshots.length);
        snapshots.forEach(element => {
            console.log(element.key);
            if(element.key=="value"){
               currentPoint=element.val();
                console.log("point:"+element.val());
                this.unsubscriber.unsubscribe();
                var pointt=this.afDatabase.object('profile/'+this.uid+'/point/')
                pointt.update({
                    value:(currentPoint-this.pointtouse)
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

          if(this.platform.is('android')){
              window["plugins"].OneSignal.getIds((idx)=>{
               this.request.tokenId=idx.userId

               var currentPoint=0;
               if(this.couponvalue!=""){
                var couponuse=this.afDatabase.object('coupon/'+this.couponkey)
                couponuse.update({
                  flag:"unavailable",
                  used_date:"2017/01/01"
                }).then(()=>{
                  this.final_price=0;
                   }).catch((error)=>{
                   });
               }


               this.afDatabase.object('/requestedList/requestedAll/'+this.orderNo).set(this.request).then((suc)=>{
                this.afDatabase.object('/requestedList/requested/'+this.orderNo).set(this.request).then((success)=>{
                  alert("신청이 완료되었습니다. for android")

                  this.navCtrl.push(StandbyPage,{pickuplocation:this.start,pickuplat:this.location.startlat,pickuplng:this.location.startlng})
              }).catch((error)=>{
                alert(error)
              })
              
               
           }).catch((error)=>{
             alert(error);
           })
            })
            }else if(this.platform.is('ios')){
              var iosSettings = {};
              iosSettings["kOSSettingsKeyAutoPrompt"] = true;
              iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
      
              // Initialize
    
              var one=window["plugins"].OneSignal
              .startInit("2192c71b-49b9-4fe1-bee8-25617d89b4e8", "916589339698")
              
              one.iOSSettings(iosSettings)
              .endInit();
              one.getIds((idx)=>{
                this.request.tokenId=idx.userId
                this.afDatabase.object('/requestedList/requestedAll/'+this.orderNo).set(this.request).then((suc)=>{
                  this.afDatabase.object('/requestedList/requested/'+this.orderNo).set(this.request).then((success)=>{
                    alert("신청이 완료되었습니다 for ios.")
                    
                    this.viewCtrl.dismiss();
                    
                }).catch((error)=>{
                  alert(error);
                })
                })
               
             }).catch((error)=>{
               alert(JSON.stringify(error));
             })
            }else{
              console.log(this.request);
              var currentPoint=0;
              if(this.couponvalue!=""){
               var couponuse=this.afDatabase.object('coupon/'+this.couponkey)
               couponuse.update({
                 flag:"unavailable",
                 used_date:"2017/01/01"
               }).then(()=>{
                 this.final_price=0;
                  }).catch((error)=>{
                  });
              }
              // if(this.pointtouse!=0){
              //  var getcurrentPoint=this.afDatabase.list('/profile/'+this.uid+'/point/', { preserveSnapshot: true })
              //  this.unsubscriber=getcurrentPoint.subscribe(snapshots=>{
              //      console.log("len"+snapshots.length);
              //   snapshots.forEach(element => {
              //       console.log(element.key);
              //       if(element.key=="value"){
              //          currentPoint=element.val();
              //           console.log("point:"+element.val());
              //           this.unsubscriber.unsubscribe();
              //           var pointt=this.afDatabase.object('profile/'+this.uid+'/point/')
              //           pointt.update({
              //               value:(currentPoint+this.mileage)
              //           }).then(()=>{
              //               var pointInsert=this.afDatabase.list("profile/"+this.uid+"/point").push({created:this.todayWithTime,valueAdded:this.mileage}).then(()=>{
              //              }).catch((error)=>{
              //              });
              //               return;
              //           })
              //       }
              //      })
              //  });
              // }

              this.afDatabase.object('/requestedList/requestedAll/'+this.orderNo).set(this.request).then((suc)=>{
                this.afDatabase.object('/requestedList/requested/'+this.orderNo).set(this.request).then((success)=>{
                  alert("신청이 완료되었습니다 for window.")
                  console.log(this.start+","+this.location.slat+",,"+this.location.slng);
                  this.navCtrl.push(StandbyPage,{pickuplocation:this.start,pickuplat:this.location.slat,pickuplng:this.location.slng})
                  
              }).catch((error)=>{
                alert(error);
              })
              }).catch((error)=>{
               alert(error)
             })
            }
        }else{
          alert("개인정보 동의해주세요")
        }
          
  }
  useCoupon(coupon){
    console.log(this.couponvalue);
    var couponflag;
    var matched="false"
    var items=this.afDatabase.list('/coupon', { preserveSnapshot: true })
    this.tounsubscribe=items.subscribe(snapshots=>{
   
        
     snapshots.forEach(element => {
         if(element.val().value==coupon){
           if(element.val().flag!="available"){
              matched="duplicated";
           }else{
            this.couponkey=element.key
            couponflag=true;
            console.log("matched")
            matched="true";
            this.tounsubscribe.unsubscribe();
           
           }
         
        }else{
          console.log("fail")
          couponflag="nofound"
        }
        
     })
     console.log(matched);
     console.log("result")
     if(matched=="true"){
      console.log("매치완료")
      this.mileage=0;
      this.pointtouse=0;
      this.coupon_flag="전액무료쿠폰"
      this.final_price=0;

     }else if(matched=="duplicated"){
       console.log("중복!")
     }else{
      console.log("일치하는 쿠폰을 찾을수없습니다")
     }
  
    })
  }
  toggle(value){
    switch (value) {
      case 1:
      this.info=!this.info;
      break;
      case 2:
      this.time=!this.time;
      break;
      case 3:
      this.freight=!this.freight
      break;
      case 4:
        this.app_payment=!this.app_payment;
        break;
      case 5:
        this.flag_payment_mean=!this.flag_payment_mean;
        break;
        case 6:
        this.discount=!this.discount;
        break;
        case 7:
        this.payment=!this.payment;
        break;
        case 8:
        this.coupon=!this.coupon;
      default:
        break;
    }
  }
  cancel(){
    this.viewCtrl.dismiss();
  }

}
