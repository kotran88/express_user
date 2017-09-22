import { GooglePlus } from '@ionic-native/google-plus';
import { ViewRequestListPage } from './../view-request-list/view-request-list';
import { ViewRequestedAllPage } from './../view-requested-all/view-requested-all';
import { request } from './../../components/models/request';
import { LoginPage } from './../login/login';
import { Http,Headers ,RequestOptions} from '@angular/http';
import { Location } from './../../components/models/location';
import { MapDirective } from './../../components/map';
import { Observable, Subscription } from 'rxjs/Rx';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, ViewChild,OnInit,ChangeDetectionStrategy, OnChanges, Input,NgZone } from '@angular/core';
import { NavController, ToastController, LoadingController, AlertController,NavParams, ModalController, Platform } from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { OneSignal } from '@ionic-native/onesignal';
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation';

import { TimeService } from './../../shared/time';

import {NotifiedPage} from './../notified/notified'
import { Geolocation } from '@ionic-native/geolocation';
import { RequestModalPage} from './../request-modal/request-modal';
import { Favorite } from './../../components/models/favorite';

declare var google;
@Component({
  changeDetection:ChangeDetectionStrategy.OnPush,
  selector: 'page-home',
  templateUrl: 'home.html',
  entryComponents: [MapDirective],
  providers:[TimeService]
})

export class HomePage implements OnInit,OnChanges  {

  countStart:number=0;
  tempStart:any;
  countEnd:number=0;
  tempEnd:string
  showingFavoriteAttribue:boolean=true
  showNext:boolean=false;
  showNextEnd:boolean=false;
  mapTopChanged:number=4;
  resetEnddd:any;
  temp_flag:boolean=false;
  showSoloMap:boolean=false;
  panningToMiddle:any;
  panningLocation:any;
  startDetail:any;
  endDetail:any;
  result_flag:boolean=false;
  first_flag:boolean=true;
  showingDetailStart:boolean=false;
  showingDetailEnd:boolean=false;
  makeMarkerInformation:any;
  makeMarker:string;
  backColor:"#0000"
  mention_detail:string="";
  distance:any;
  showingDestination:boolean=false;
  showingStart:boolean=false;
  default:boolean=true;
  height:any="20%";
  showingByClickEnd:boolean=false;
  mention:string="출발지/도착지를 선택해주세요";
  price:any=4500;
  showingMap:boolean=false;
  showingByClickStart:boolean=false;
  @ViewChild('searchBar') myInput ;
  @ViewChild('searchBar_end') myInput_end ;
  slat:any;
  slng:any;
  elat:any;
  elng:any;
  width_style:number;
  //마우스 업 할때 좌표저장 to get distance
  resetEndd:any;
  resetStart:boolean=false;
  resetStartt:any;
  resetStarttt:any;
  resetEnd:boolean=false;
  resetAll:boolean=false;
  changeMarker:string;
  toastshow_end:boolean=true;
  toastshow:boolean=true;
  showFavorite:boolean=true;
  favorite_information=[];
  new_addresss:string;
  start_address:string;
  count:number=0;
  showResult:boolean=false;
  onlymap:boolean=true;
  showndistance:any;
  location={} as Location
  request={} as request
  favorite_list={} as Favorite
  Destination:string;
  MyLocation:any;
  geoCode:boolean=false;
  isPickupRequested:boolean=false;
  start:string;
  address:any;
  destination:string;
  startLat:any;
  startLng:any;
  startLat2:any;
  startLng2:any;
  endLat:any;
  endLng:any;
  endLat2:any;
  endLng2:any;
  tokenId:string;
  activePage:any;
  public startPoint:string;
  @Input() test:any;
  public isactive:any;
  interval:any;
  endPoint:string;
  userId:string;
  requested:boolean=false;
  items:any;
  it:any;
  result=[];
  showMyStart:boolean=false;
  showMyEnd:boolean=false;
  panTodeliveryGuy:any;
  isToggled:boolean=false;
  pages: Array<{title:string,component:any,attr:any}>;
  requestedRoute=[];
  firestore=firebase.database().ref('/pushtokens');
  firemsg=firebase.database().ref('/messages');
  result_metro:any;
  totalNumber:number=0;
  deliverer_location:any;
  public watch: any;  
  myEnd:any;
  myStart:any;
  public lat: number = 0;
  public lng: number = 0;
  totalOrder=[];
  phone:string;
  imageUrl:string;
  uid:string;
  fetchingExpress:any;
  deliveryGuy:any;
  constructor(public map:MapDirective, public keyboard:Keyboard,public toast:ToastController,public zone : NgZone,private alertCtrl: AlertController,public t:TimeService,public navCtrl: NavController,public navParam:NavParams , public modalCtrl:ModalController, public loading:LoadingController, 
    private geo:Geolocation,private afDatabase:AngularFireDatabase,public afAuth : AngularFireAuth,private googleplus:GooglePlus
  ,private oneSignal: OneSignal, public platform:Platform,private backgroundGeolocation: BackgroundGeolocation,public http:Http) {
    var id=localStorage.getItem("id");
    this.uid=localStorage.getItem("uid");
    this.phone=localStorage.getItem("phone");
    this.imageUrl=localStorage.getItem("foto");
    if(id!=undefined||id!=null){
    this.userId=id;
    }else{
    this.userId="admin"
    }
    if(this.uid==""||this.uid==undefined){
      this.uid="evCJcw2WnGWlwUcFVk1K1kHVQzJ2"
    }

    if(this.imageUrl==undefined){
      this.imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"
    }
     
   
    this.it=this.afDatabase.list('/requestedList/requestedAll', { preserveSnapshot: true })
    this.it.subscribe(snapshots=>{
      this.totalNumber=snapshots.length;
    })
    
   
    
 
    this.pages=[
        
        {title:'나의 주문 목록 보기',component:ViewRequestListPage,attr:"request"},
        {title:'크레딧 상세보기',component:ViewRequestListPage,attr:"request"},
        {title:'로그아웃',component:ViewRequestListPage,attr:"Logout"}
      ]
      this.activePage=this.pages[0];
    this.address = {
      place: ''
    };
   //this.startTracking();

  }
  getFavorite(element){
    this.first_flag=false;
    this.result_flag=true;
    this.startDetail=element.startDetail;
    this.endDetail=element.endDetail;
    this.startPoint=element.startPoint;
    this.endPoint=element.endPoint;
    var distance=this.getdistance(element.startLat,element.startLng,element.endLat,element.endLng);
    this.showndistance=distance;
    this.showResult=true;
    this.default=true;
    this.calculatePrice(this.showndistance);

  }
  mapIsCreated(value){
    if(value=="true"){
      var notification=this.navParam.get("notification");
      var notivalue=this.navParam.get("notificationValue");
      var foto=this.navParam.get("foto");
      var distance=this.navParam.get("distance");
      if(notification!=undefined){
        this.fetchingExpress=true;
        this.deliveryGuy=notivalue;
        this.panTodeliveryGuy="true";
        this.items = this.afDatabase.list('/employees_status/Available/', { preserveSnapshot: true });
        console.log('Hello SimulateProvider Provider');
        this.items.subscribe(snapshots=>{
            snapshots.forEach(element => {
     
              //특정유저로 한정시킨다. (여기서는 배송자 한사람에 대해서만 보여주면 되기에 한명으로 한정함. )
              if(element.val().userid==this.deliveryGuy){
                console.log("deliveryGuy is : "+this.deliveryGuy);
                console.log("pushed");
                this.deliverer_location={lat:element.val().lat,lng:element.val().lng}
                console.log(element.val().lat+"!!!!"+element.val().lng);
              }
              
              
            });
        })
       // "id":this.userId,"foto":this.foto,"time": todaywithTime,"distance":distance
       let modal = this.modalCtrl.create(NotifiedPage,{name:'정긍정',id:notivalue,foto:foto,distance:distance});
       let me = this;
       modal.onDidDismiss(data => {
       });
       modal.present();
      }
    }
  }
  ionViewDidLoad(){
    
  //   if(this.platform.is('android')){
  //     window["plugins"].OneSignal
  //     .startInit("2192c71b-49b9-4fe1-bee8-25617d89b4e8", "916589339698")
  //     .handleNotificationOpened((jsonData)=> {
  //       let value=jsonData.notification.payload.additionalData
  //       if(value.status=="assigned"){
  //         this.fetchingExpress=true;
  //             this.deliveryGuy=value.name;
  //             this.panTodeliveryGuy="true";
  //             this.items = this.afDatabase.list('/employees_status/Available/', { preserveSnapshot: true });
  //             console.log('Hello SimulateProvider Provider');
  //             this.items.subscribe(snapshots=>{
  //                 snapshots.forEach(element => {
           
  //                   //특정유저로 한정시킨다. (여기서는 배송자 한사람에 대해서만 보여주면 되기에 한명으로 한정함. )
  //                   if(element.val().userid==this.deliveryGuy){
  //                     console.log("deliveryGuy is : "+this.deliveryGuy);
  //                     console.log("pushed");
  //                     this.deliverer_location={lat:element.val().lat,lng:element.val().lng}
  //                     console.log(element.val().lat+"!!!!"+element.val().lng);
  //                   }
                    
                    
  //                 });
  //             })
  //            // "id":this.userId,"foto":this.foto,"time": todaywithTime,"distance":distance
  //            let modal = this.modalCtrl.create(NotifiedPage,{name:'a',id:value.name,foto:value.foto,time:value.todaywithTime,distance:value.distance});
  //            let me = this;
  //            modal.onDidDismiss(data => {
  //            });
  //            modal.present();
  //        }else{
  //            alert("nope");
  //        }
      
  //     })
  //     .endInit();
      
      
  // }else if(this.platform.is('ios')){
  //     // Set your iOS Settings
  //         var iosSettings = {};
  //         iosSettings["kOSSettingsKeyAutoPrompt"] = true;
  //         iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
  
  //         // Initialize

  //         var one=window["plugins"].OneSignal
  //         .startInit("2192c71b-49b9-4fe1-bee8-25617d89b4e8", "916589339698")
          
  //         one.iOSSettings(iosSettings)
          
  //         one.handleNotificationOpened((jsonData)=> {
  //        let value=jsonData.notification.payload.additionalData
  //        if(value.status=="assigned"){
  //         this.fetchingExpress=true;
  //             this.deliveryGuy=value.name;
  //             this.panTodeliveryGuy="true";
  //             this.items = this.afDatabase.list('/employees_status/Available/', { preserveSnapshot: true });
  //             console.log('Hello SimulateProvider Provider');
  //             this.items.subscribe(snapshots=>{
  //                 snapshots.forEach(element => {
           
  //                   //특정유저로 한정시킨다. (여기서는 배송자 한사람에 대해서만 보여주면 되기에 한명으로 한정함. )
  //                   if(element.val().userid==this.deliveryGuy){
  //                     console.log("deliveryGuy is : "+this.deliveryGuy);
  //                     console.log("pushed");
  //                     this.deliverer_location={lat:element.val().lat,lng:element.val().lng}
  //                     console.log(element.val().lat+"!!!!"+element.val().lng);
  //                   }
                    
                    
  //                 });
  //             })
  //            // "id":this.userId,"foto":this.foto,"time": todaywithTime,"distance":distance
  //            let modal = this.modalCtrl.create(NotifiedPage,{name:'a',id:value.name,foto:value.foto,time:value.todaywithTime,distance:value.distance});
  //            let me = this;
  //            modal.onDidDismiss(data => {
  //            });
  //            modal.present();
  //        }else{
  //            alert("nope");
  //        }
  //       })
  //       one.endInit();
  // }else{
  //   this.fetchingExpress=true;
  //   this.deliveryGuy="kotraner88";
  //   this.panTodeliveryGuy="true";
  //   this.items = this.afDatabase.list('/employees_status/Available/', { preserveSnapshot: true });
  //   console.log('Hello SimulateProvider Provider');
  //   this.items.subscribe(snapshots=>{
  //       snapshots.forEach(element => {
 
  //         //특정유저로 한정시킨다. (여기서는 배송자 한사람에 대해서만 보여주면 되기에 한명으로 한정함. )
  //         if(element.val().userid==this.deliveryGuy){
  //           console.log("deliveryGuy is : "+this.deliveryGuy);
  //           console.log("pushed");
  //           this.deliverer_location={lat:element.val().lat,lng:element.val().lng}
  //           console.log(element.val().lat+"!!!!"+element.val().lng);
  //         }
          
          
  //       });
  //   })

  //     //window 일 경우. test purpose only
  //             // "id":this.userId,"foto":this.foto,"time": todaywithTime,"distance":distance
  //             // let modal = this.modal.create(NotifiedPage,{name:'a',id:"kotraner88",foto:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png",time:"2017/08/17",distance:1000});
  //             // let me = this;
  //             // modal.onDidDismiss(data => {
                  
  //             // });
  //             // modal.present();

  //             // let modala = this.modal.create(FinishedPage,{id:"id", name:"name",foto:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png",time:"2017/08/17"});
  //             // modala.onDidDismiss(data => {
  //             //     alert("end")
  //             // });
  //             // modala.present();

              
  //     // let data={
  //     //           "app_id": "2192c71b-49b9-4fe1-bee8-25617d89b4e8", 
  //     //    "include_player_ids": ["7e0947ff-0001-472d-b55c-8e61d1e37249"],
  //     //    "data": {"welcome": true, "name":"pdJung"},
  //     //    "contents": {"en": "testtest"}
  //     //       }
  //     //       let headers = new Headers({ 'Content-Type': 'application/json' });
  //     //      let options = new RequestOptions({ headers: headers });
  
  //     //        this.http.post('https://onesignal.com/api/v1/notifications', data, options).toPromise().then((res)=>{
  //     //           console.log(res.json())
  //     //           alert("success")
  //     //       }).catch((error)=>{
  //     //       })
  
  
  //     // let modal = this.modal.create(FinishedPage,{id:"id", name:"name",foto:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png",time:"2017/08/17"});
  //     // let me = this;
  //     // modal.onDidDismiss(data => {
  //     //     alert("end")
  //     // });
  //     // modal.present();
  //     // let modal = this.modal.create(NotifiedPage);
  //     // let me = this;
  //     // modal.onDidDismiss(data => {
      
  //     // });
  //     // modal.present();
  // }


  }
  showonlyMap(){
    this.onlymap=false;
    this.first_flag=false;
    this.result_flag=false;
    this.default=false;
    this.showResult=false;
    this.showSoloMap=true;
  }
  favorite(){
    this.presentPrompt();
  }
  
  showMap(v){
      console.log(v);
      console.log("!")
      if(this.startPoint!=""&&this.endPoint!=""){
        this.showingFavoriteAttribue=true;
        this.first_flag=false;
        this.result_flag=true;
        this.showResult=true;
        this.default=true;
        this.onlymap=true;
      }else{
        this.first_flag=true;
        this.result_flag=false;
        this.showResult=false;
        this.onlymap=true;
        this.showSoloMap=false;
        this.showingFavoriteAttribue=true;
      }
      
   
  }
  favorite_list_shown(value){
    this.favorite_information=value;
  }
  my_count(value){
    this.count=value;
  }
  my_start(value){
    console.log("myStart");
    console.log(value);
    console.log(value.length);
    this.myStart=value;
    

  }
  my_end(value){
    console.log(value);
    this.myEnd=value;
  }
  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: '즐겨찾기명을 입력해주세요',
      inputs: [
        {
          name: 'name',
          placeholder: '즐겨찾기명'
        }
      ],
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '확인',
          handler: data => {
            console.log(data.name);

            var slat;
    var slng;
    var elat;
    var elng;
    
    if(this.slat!=undefined){
      console.log("zzz")
      slat=this.slat;
      slng=this.slng;
      elat=this.elat;
      elng=this.elng;
    }
    console.log(slat+slng+",,,"+elat+","+elng)
    this.favorite_list.startPoint=this.startPoint;
    this.favorite_list.endPoint=this.endPoint;
    this.favorite_list.startLat=slat;
    this.favorite_list.startLng=slng;
    this.favorite_list.endLat=elat;
    this.favorite_list.endLng=elng;
    this.favorite_list.create_date=this.t.getTime();
    this.favorite_list.title=data.name;
    this.favorite_list.startDetail=this.startDetail;
    this.favorite_list.endDetail=this.endDetail

    console.log(this.favorite_list);
    this.afDatabase.list("profile/"+this.uid+"/favorite").push(this.favorite_list).then(()=>{
      console.log(this.favorite_list);

    }).catch((error)=>{
    });

          }
        }
      ]
    });
    alert.present();
  }
  viewRequestedAll(){
    this.navCtrl.push(ViewRequestedAllPage,{userId:this.userId})
  }
  getdistance(slat,slng,elat,elng){
    var showndistance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(slat,slng),
    new google.maps.LatLng(elat,elng));  
    showndistance=parseInt(showndistance);
    showndistance=showndistance/1000
    console.log(slat+","+slng+"!!!!"+elat+"!!"+elng);
    console.log("alling calculatorPrice4")
    this.calculatePrice(showndistance);
    return showndistance;
    }
    reset(){
      this.startPoint="";
      this.endPoint="";
      this.changeMarker="startMarker";
      this.resetAll=!this.resetAll;
      this.showResult=false;
    }
    removeStartMarker(value){
      this.changeMarker="startMarker";
      this.showResult=false;
      this.resetStart=!this.resetStart;
      console.log(this.resetStart);
      if(value=="true"){
        this.resetStartt=!this.resetStartt;
      }else if(value=="no true"){
        this.resetStarttt=!this.resetStarttt;
        console.log("notrue");
        console.log(this.resetStarttt);
      }
      console.log(this.resetStartt);
    }
    removeEndMarker(value){
      console.log("확인버튼을 눌렀으므로 최근것을 제외한 모든것을 삭제. ")
      this.changeMarker="endMarker";
      console.log(this.resetEnd);
      this.resetEnd=!this.resetEnd;
      console.log(this.resetEnd);
      if(value=="true"){
        this.resetEndd=!this.resetEndd;
      }else if(value=="no true"){
        //확인버튼을 눌렀으므로 최근것을 제외한 모든것을 삭제. 

        this.resetEndd="confirm";
      }
      console.log(this.resetEndd)
    }
  new_address(v){
    //mouse up을 통해 주소가 입력될때

    
    console.log(v);
    console.log(v.location.latLng.lat+",,"+v.location.latLng.lng);
    this.zone.run(()=>{
      if(v.flag=="startMarker"){
        this.showingDetailEnd=false;
        this.showingDetailStart=true;
        this.showingByClickStart=true;
        this.slat=v.location.latLng.lat;
        this.slng=v.location.latLng.lng;
        this.countStart++;
        if(this.countStart==1){
          this.startPoint=v.address;
          this.tempStart=v.address;
          if(this.startPoint!=undefined||this.startPoint!=""){
            console.log("setting")
            this.mention_detail="도착지 : "+this.startPoint+"입니다."
         
        }
        }else{
          this.startPoint=v.address;
          this.mention_detail="도착지 : "+v.address;
          this.resetStarttt=!this.resetStarttt;
          this.tempEnd=v.address;
            
        }
        console.log(this.startPoint);
       var temp=this.startPoint;
        if(this.startPoint!=undefined){
          console.log("!?")
          console.log(this.startPoint);
          if(this.startPoint!=""){
            
          }else{
            this.startPoint=v.address;
          }
          
            
        }else{
          this.startPoint=v.address;
        }
        
        
        if(this.elat!=undefined){
          console.log("543")
          var distance=this.getdistance(this.slat,this.slng,this.elat,this.elng);
          if(distance!=NaN){
            this.showndistance=distance;

            this.startPoint=v.address;
            console.log("alling calculatorPrice3")
            this.calculatePrice(this.showndistance);
            if(this.startPoint!=""&&this.endPoint!=""){
              this.showResult=true;
              this.default=true;
            }
          }
        }
        if(this.endPoint==undefined||this.endPoint==""){
          this.mention="도착지를 선택해주세요";
          if(this.startPoint!=undefined||this.startPoint!=""){

            this.mention_detail="픽업지 : "+this.startPoint+"입니다."
          }
        }
        this.changeMarker="startMarker";

      }else if(v.flag=="endMarker"){
        console.log("endMarker2222"+this.endPoint);
        this.elat=v.location.latLng.lat;
        this.elng=v.location.latLng.lng;
        this.countEnd++;
        
        console.log(this.countEnd);
        if(this.countEnd==1){
          this.endPoint=v.address;
          this.tempEnd=v.address;
          if(this.endPoint!=undefined||this.endPoint!=""){
            console.log("setting")
            this.mention_detail="도착2 : "+this.endPoint+"입니다."
         
        }
        }else{
          this.endPoint=v.address;
          this.mention_detail="도착지 : "+v.address;
          this.resetEnddd=!this.resetEnddd;
          
            this.tempEnd=v.address;
            
        }

        console.log("도착지 : "+this.endPoint);
          
       
        console.log("getdistance:"+this.slat+","+this.slng+","+this.elat+","+this.elng)
        this.showndistance=this.getdistance(this.slat,this.slng,this.elat,this.elng)
        console.log(this.showndistance);
        this.calculatePrice(this.showndistance);
        this.changeMarker="endMarker";
      }
     });
     console.log("endofmouseup")
     console.log(this.startPoint);
    
  }
  showNextClick(value){
    this.showingFavoriteAttribue=true;
    console.log(this.startPoint+",,,"+this.endPoint);
    console.log(value);
    if(value=="start"){
      console.log("1");
      
      // this.showSoloMap=false;
      // this.onlymap=true;
      // this.first_flag=true;
      // this.result_flag=false;
      // this.showingByClickStart=true;
      // this.showingByClickEnd=false;
      // this.showMyStart=false;
      // this.showMyEnd=false;
      // this.showingDetailStart=true;
      // this.showingDetailEnd=false;
      // this.changeMarker="default";

      this.showSoloMap=false;
      this.onlymap=true;
      this.first_flag=true;
      this.result_flag=false;
      this.showingByClickStart=false;
      this.showingByClickEnd=true;
      this.showMyStart=false;
      this.showMyEnd=false;
      this.showingDetailStart=false;
      this.showingDetailEnd=true;
      this.changeMarker="default";
      this.showNext=false;
    }
    if(value=="end"){
      console.log("2")
        // this.showSoloMap=false;
        // this.onlymap=true;
        // this.first_flag=true;
        // this.result_flag=false;
        // this.showingByClickStart=false;
        // this.showingByClickEnd=true;
        // this.showMyStart=false;
        // this.showMyEnd=false;
        // this.showingDetailStart=false;
        // this.showingDetailEnd=true;
        console.log(this.startPoint);
        if(this.startPoint==""){
        
          console.log("출발지를 선택해주세요")
          this.first_flag=true;
          this.result_flag=false;
          this.showResult=false;
          this.showingMap=false;
          this.showMyEnd=false;
          this.showingByClickEnd=false;
          this.showingByClickStart=false;
          this.showingDetailEnd=false;
          this.showingDetailStart=false;
          this.changeMarker="default";
          this.temp_flag=false;
          this.mapTopChanged=4;
        }else{
          this.finalize();
        }
        
        // console.log("4")
        // this.default=true;
        // this.first_flag=false;
        // this.result_flag=true;
        // this.showResult=true;
        // this.onlymap=true;
        // this.showSoloMap=false;
        // this.changeMarker="default";
        this.showNextEnd=false;
    }
    
    // if(this.endPoint!=""&&this.startPoint!=""){
    //   console.log("2")
    //   this.showSoloMap=false;
    //   this.onlymap=true;
    //   this.first_flag=true;
    //   this.result_flag=false;
    //   this.showingByClickStart=false;
    //   this.showingByClickEnd=true;
    //   this.showMyStart=false;
    //   this.showMyEnd=false;
    //   this.showingDetailStart=false;
    //   this.showingDetailEnd=true;
    //   this.changeMarker="default";
    // }else{
    //   console.log("3")
    //   this.first_flag=true;
    //   this.result_flag=false;
    //   this.showResult=false;
    //   this.onlymap=true;
    //   this.showSoloMap=false;
    // }
    // if(this.temp_flag){
    //   console.log("4")
    //   this.default=true;
    //   this.first_flag=false;
    //   this.result_flag=true;
    //   this.showResult=true;
    //   this.onlymap=true;
    //   this.showSoloMap=false;
    // }
  }
  finalize(){
    this.mapTopChanged=0;
    this.temp_flag=true;
    if(this.endPoint==""){
      let alert = this.alertCtrl.create({
        title: "주소를 모두<br>입력해주세요!",
        
        buttons: [
         
          {
            text: '확인',
            handler: data => {
              this.showingDetailStart=false;
              this.showingDetailEnd=true;
              this.default=false;
              return;
            }
          }
        ]
        })
        alert.present();
    }else{
      this.first_flag=false;
      this.result_flag=true;
      this.showingDetailEnd=false;
      this.showingDetailStart=false;
      
      if(this.startPoint!=""&&this.endPoint!=""){
        console.log(this.slat+"!!!"+this.slng+"!!!"+this.elat+this.elng);
        var distance=this.getdistance(this.slat,this.slng,this.elat,this.elng);
        console.log(distance);
        if(distance!=NaN){
          this.changeMarker="default";
          this.showndistance=distance;
          this.showResult=true;
          this.default=true;
  
          var lat_middle=(this.slat+this.elat)/2;
          var lng_middle=(this.slng+this.elng)/2;
          console.log(lat_middle);
          console.log(lng_middle);
          var location_middle=new google.maps.LatLng(lat_middle,lng_middle);
          var param=[];
          param.push(location_middle);
          param.push(this.showndistance);
          console.log(this.showndistance);

          this.panningToMiddle=!this.panningToMiddle;
            this.panningLocation=param;
            param=[];
  
        }
      }
    }
    
  }
  showingFavorite(){
    this.showFavorite=!this.showFavorite;
  }
   openPage(page){
    if(page.attr=="Logout"){
      if(this.platform.is("android")){
        this.googleplus.disconnect();
        localStorage.setItem("googleLoggedIn","false")
        this.navCtrl.setRoot(LoginPage);
      }else{
        alert("not web")
      }
    }else{
      this.navCtrl.push(page.component);
      this.activePage=page;
    }
    
    
  }
  checkActive(page){
    return page==this.activePage;
  }
  
  undoFunction(){
    this.toastshow=false;
  }
  undoFunction_end(){
    this.toastshow_end=false;
  }
  selectOnMap(){
    this.showingMap=false;
    this.showingDestination=false;
    this.showingStart=false;

    this.keyboard.close();
  }
  
  chooseItem(value){

    this.showingByClickStart=true;
    this.showingByClickEnd=false;

    this.showingDetailStart=true;
    this.showMyStart=false;
    this.showingDetailEnd=false;

    this.mention="";

    console.log(value);
    this.startPoint=value.place;
    this.slat=value.lat;
    this.slng=value.lng;
    this.makeMarkerInformation=[];
    console.log("chooseItem")
    console.log(this.slat+","+this.slng);
    this.makeMarker="start";
    this.makeMarkerInformation={lat:this.slat,lng:this.slng};
    if(this.endPoint.length!=0){
      console.log(this.slat+",,,"+this.slng);
      console.log(this.elat+",,,"+this.elng);
      console.log("distanceResult")
      var distance=this.getdistance(this.slat,this.slng,this.elat,this.elng);
      console.log(distance);
      this.showndistance=distance;
      console.log("alling calculatorPrice2")
      this.calculatePrice(distance);
        this.showResult=true;
        this.default=true;
        this.showingByClickEnd=false;
        console.log("fffffff")
        if(this.endPoint!=""){
          console.log("fa1")
          this.showingByClickStart=true;
        }else{
          console.log("fa2")
          this.showingByClickStart=false;
        }
        
        this.showingMap=false;
        this.default=true;
    }else{

    }
  }
  chooseItem_end(value){

    this.mention="";
    this.showingDetailEnd=true;
    this.showingDetailStart=false;
    this.elat=value.lat;
    this.elng=value.lng;
    this.makeMarkerInformation=[];
    this.makeMarker="end";
    this.makeMarkerInformation={lat:this.elat,lng:this.elng};
    this.showMyEnd=false;
    console.log("chooseItem_end");
    console.log(this.elat+","+this.elng);
    this.endPoint=value.place;
      console.log("chooseItem_end"+this.showndistance);
      console.log(this.startPoint);
      // if(this.startPoint.length!=0){
      //   console.log("yes")
      //   console.log(this.slat+",,,"+this.slng);
      //   console.log(this.elat+",,,"+this.elng);
      //   console.log("distanceResult222")
      //   var distance=this.getdistance(this.slat,this.slng,this.elat,this.elng);
      //   console.log(distance);
      //   this.showndistance=distance;
      //   this.calculatePrice(distance);
      //     this.showResult=true;
      //     this.default=true;
      //     this.showingByClickEnd=false;
      //     this.showingByClickStart=false;
      //     this.showingMap=false;
      //     this.default=true;
      // }else{
      //   console.log("start no so select start");
      //   this.selectStart();
      // }
      
    }
  entered(){
    console.log("entered")
    this.showingDetailStart=false;
    this.default=false;
    this.showMyStart=true;
    var upper=document.getElementById("upper")
    console.log("entered");
    this.mention="지도를 드래그를 하거나 직접 입력해주세요"
    console.log(upper.offsetWidth);
    this.width_style=upper.offsetWidth;
    this.default=false;
    console.log(this.endPoint)
    if(this.endPoint!=""&&this.startPoint!=""){
      this.reset();
      this.showResult=false;
    }
    if(this.endPoint==""||this.endPoint==undefined){
      
      this.showingDestination=true;
          }else{
            this.showingDestination=false;
          }
    this.showingStart=false;
    console.log("map true");
    this.showingMap=true;
    this.showingByClickStart=true;
    this.showingByClickEnd=false;
    console.log(this.startPoint);
    this.changeMarker="startMarker";
    if(this.startPoint==""){
      this.showResult=false;
    }
    
    // if(this.toastshow){
    //   let toast = this.toast.create({
    //     message: '출발지를 직접 입력하거나,   '+'직접드래그하세요',
    //     duration: 1200,
    //     position: 'top',
    //     showCloseButton:true,
    //     closeButtonText:"다시보지않기",
    //     });
    //     toast.onDidDismiss((data,role) => {
    //       console.log(role);
    //       setTimeout(() => {
    //         console.log("sss")
    //         this.myInput.setFocus();
    //       },150);
    //       console.log(role);


    //       this.changeMarker="startMarker";

    //       if (role == "close") {
    //         this.undoFunction();
    //       }
    //     });
    //     toast.present();
    // }
     


    //출발지 클릭시 맵화면 커지고, 도착/신청메뉴 사라지면서
    //드래그를 통해서 위치를 미세설정하거나, 주소를 입력해서 출발지를 입력할수 있도록 한다. 

  }
  selectEnd(){
    if(this.startPoint==""){
      let alert = this.alertCtrl.create({
        title: "주소를 모두<br>입력해주세요!",
        
        buttons: [
         
          {
            text: '확인',
            handler: data => {
              this.showingDetailStart=true;
              this.showingDetailEnd=false;
              this.default=false;
              return;
            }
          }
        ]
        })
        alert.present();
    }else {

      if(this.endPoint!=""){
        this.finalize();
      }else{
        console.log("selectEnd")
        this.showingDetailStart=false;
        this.showingDetailEnd=true;
        this.mention="도착지를 지도에서 드래그하거나, 직접 입력해주세요";
        this.changeMarker="endMarker";
        this.default=false;
        console.log("true2")
        this.zone.run(()=>{
          this.showingMap=true;
          this.showingByClickEnd=true;
          console.log("ffffff2")
          this.showingByClickStart=false;
          this.showingDestination=false;
          if(this.startPoint==""||this.startPoint==undefined){
            
            this.showingStart=true;
          }else{
            this.mention_detail="출발지는 : "+this.startPoint;
            this.showingStart=false;
          }
        })
      }
      
    }
    
  }
  selectStart(){
    this.mention="출발지를 지도에서 드래그하거나, 직접 입력해주세요";
    this.default=false;
    if(this.endPoint==""||this.endPoint==undefined){
      this.showingDestination=true;
      
    }else{
      
      this.mention_detail="도착지는 :"+this.endPoint;
      this.showingDestination=false;
    }
    this.showingStart=false;
    console.log("maptrue3")
    this.showingMap=true;
    this.showingByClickEnd=false;
    this.showingByClickStart=true;
  }
  endingPoint(){
    this.showMyEnd=true;
    this.showingDetailEnd=false;
    this.default=false;
    this.showingDestination=false;
    var upper=document.getElementById("upper")
    console.log("endingPoint");
    console.log(upper.offsetWidth);
    this.width_style=upper.offsetWidth;
    console.log(this.startPoint)
    if(this.startPoint!=""&&this.endPoint!=""){
      this.showResult=false;
      this.reset();
    }
    if(this.startPoint==""||this.startPoint==undefined){

      this.showingStart=true;
    }else{
      this.showingStart=false;
    }
    console.log("map true 4")
    this.showingMap=true;
    console.log("fffffffffff3")
    this.showingByClickStart=false;
    this.showingByClickEnd=true;
    console.log(this.endPoint);
    this.changeMarker="endMarker";
    if(this.endPoint==""){
      this.showResult=false;
    }else{
      
    }
        // if(this.toastshow_end){
        //   let toast = this.toast.create({
        //     message: '도착지를 직접 입력하거나,   '+'직접드래그하세요',
        //     duration: 1000,
        //     position: 'bottom',
        //     showCloseButton:true,
        //     closeButtonText:"다시보지않기",
        //     dismissOnPageChange:true
        //     });
        //     toast.onDidDismiss((data,role) => {
        //       console.log(role);
        //       setTimeout(() => {
        //         console.log("sss")
        //         this.myInput_end.setFocus();
        //       },150);

        //       this.changeMarker="endMarker";
              
        //       if (role == "close") {
        //         this.undoFunction_end();
        //       }
        //     });
        //     toast.present();
        // }
      }
  starting(value){
    this.start=value;
    console.log("get value : "+value);
  }
  ending(value){
    this.destination=value;
  }
  // startLocation(value){
  //   this.startPoint=value;
  //   this.full_address=value;
  //   console.log(value);
  //   //출발지 클릭됨
  // }
  // endLocation(value){
  //   this.endPoint=value;
  //   this.showResult=true;
  //   this.showndistance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.startLat2, this.startLng2),
  //   new google.maps.LatLng(this.endLat2, this.endLng2));  
  //   this.showndistance=parseInt(this.showndistance);
  //   this.showndistance=this.showndistance/1000

   

  //   //도착지 클릭됨. 
  // }
  // full_address(value){
  //   console.log(value);
  //   this.start_address=value.address;


  // }
  full_address(value){
    console.log(value);
    this.zone.run(()=>{
      if(value.flag=="start"){
        this.startPoint=value.address;
        this.default=false;
        this.showingByClickEnd=false;
        this.showingByClickStart=true;
        this.slat=value.slat;
        this.slng=value.slng;
        console.log("true")
        this.showingDetailStart=true;
        this.showingDetailEnd=false;
      }else if(value.flag=="end"){
        this.endPoint=value.address;
        this.default=false;
        this.showingByClickEnd=true;
        console.log("fffffffff5")
        this.showingByClickStart=false;
        this.elat=value.elat;
        this.elng=value.elng;
        console.log("true")
        this.showingDetailStart=false;
        this.showingDetailEnd=true;
      }
    })
   
  }
  sLat(value){
    this.startLat2=value
  }
  sLng(value){
    this.startLng2=value;
  }
  eLat(value){
    this.endLat2=value;
  }
  eLng(value){
    this.endLng2=value;
  }
  requesting(){
    if(this.startPoint==undefined||this.endPoint==undefined||this.startPoint==""||this.endPoint==""){
      alert("출발역, 도착역을 입력해주세요")
    }else{
      if(this.endLat==undefined){
                this.request.endLat=this.endLat2;
                this.request.endLng=this.endLng2;
                this.request.startLat=this.startLat2;
                this.request.startLng=this.startLng2 ;
        }else{
          this.request.endLat=this.endLat;
          this.request.endLng=this.endLng;
          this.request.startLat=this.startLat;
          this.request.startLng=this.startLng;
        }
        var loc={startlat:this.slat,startlng:this.slng,endlat:this.elat,endlng:this.elng}
       console.log(loc);
      this.navCtrl.push(RequestModalPage,{start: this.startPoint   , end: this.endPoint, 
        startDetail:this.startDetail,endDetail:this.endDetail,dis:this.distance,
        favorite_list:this.favorite_information,location:loc,totalNumber:this.totalNumber,price:this.price,uid:this.uid});
      
//       var sp=this.startPoint;
//       var ep=this.endPoint;
//       this.startPoint="";
//       this.endPoint=""
      
// var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.startLat, this.startLng),
//  new google.maps.LatLng(this.endLat, this.endLng));       
//       distance=(parseInt(distance)/1000);
      
//       this.request.startPoint=this.startPoint;
//       this.request.endPoint=this.endPoint;
//       let today = new Date();
//         let dd:number;
//         let day:string;
//         let month:string;
//          dd = today.getDate();
//         var mm = today.getMonth()+1; //January is 0!

//         var yyyy = today.getFullYear();
//        var time=new Date().toLocaleTimeString('en-US', { hour12: false,hour: "numeric",minute: "numeric"});
       
//         dd<10?day='0'+dd:day=''+dd;
//         mm<10?month='0'+mm:month=''+mm;
//         let todayNoTime= yyyy+" "+mm+" "+dd;
//         let todayNoTime2=yyyy+'/'+month+'/'+day;
//       let todayWithTime = yyyy+'/'+month+'/'+day+' '+time;
//           let todayWithTime2 = yyyy+'/'+month+'/'+day;
//       this.request.user=this.userId
//       this.request.create_date=todayWithTime;
//       this.request.status="requested";
//       this.request.startPoint=sp;
//       this.request.endPoint=ep;
//       if(this.endLat==undefined){
//         this.request.endLat=this.endLat2;
//         this.request.endLng=this.endLng2;
//         this.request.startLat=this.startLat2;
//         this.request.startLng=this.startLng2 ;
//       }else{
//         this.request.endLat=this.endLat;
//         this.request.endLng=this.endLng;
//         this.request.startLat=this.startLat;
//         this.request.startLng=this.startLng;
//       }
//       this.request.onlyDate=todayNoTime2;
        
//       this.it=this.afDatabase.list('/requestedList/requestedAll', { preserveSnapshot: true })
//       this.it.subscribe(snapshots=>{
//         this.totalNumber=snapshots.length;
       
//       })
      
      
//       var orderNo=yyyy+month+day+'0000'+this.totalNumber;
//       this.request.orderNo=orderNo;
//       this.requested=true;
//       if(this.platform.is('android')){
//           window["plugins"].OneSignal.getIds((idx)=>{
//            this.request.tokenId=idx.userId
//            this.afDatabase.object('/requestedList/requestedAll/'+orderNo).set(this.request).then((suc)=>{
//           }).catch((error)=>{
//             alert(error)
//           })
//           this.afDatabase.object('/requestedList/requested/'+orderNo).set(this.request).then((success)=>{
//            this.totalOrder=[];
//            alert("입력성공")
           
           
           
//        }).catch((error)=>{
//          alert(error);
//        })
//         })
//         }else{
//           console.log("this.request");
//           console.log(this.request);
          
//         }
  
       
       
     
      
      
    }
   
  }
  refresh(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component)
  }
  drag_second(trigger){
        var upper=document.getElementById("upper");
        console.log(upper);
        if(trigger){

        // upper.setAttribute('class','upper isactive');
        console.log("trigger true")
        }else{
          // upper.removeAttribute('class');
          // upper.setAttribute('class','upper');
          console.log("trigger false")
        }
    }
  
  closePast(value){
    
    
    this.default=true;
    if(value=="start"){
      this.showingByClickStart=true;
      this.showingByClickEnd=false;
      this.showingDetailStart=true;
      this.showMyStart=false;
      this.showingDetailEnd=false;
    }else if(value=="end"){
      console.log("endxx")
      console.log("ffffffffff6")
      this.showingByClickStart=false;
      this.showingByClickEnd=true;
      this.showingDetailStart=false;
      this.showingDetailEnd=true;
      this.showMyEnd=false; 
    }
  }
  cancel(flag){

    if(flag=="start"){
      console.log("fffffff7")
      this.showingByClickStart=false;
      this.showingByClickEnd=false;
      this.showResult=false;
      this.showingDetailStart=false;
      this.default=false;
      this.startPoint="";
      this.endPoint="";
      this.startDetail="";
      this.endDetail="";
      this.removeStartMarker("true");
      this.removeEndMarker("true");

    }else if(flag=="end"){
      this.endPoint="";
      this.startPoint="";
      this.startDetail="";
      this.endDetail="";
      console.log("ffffffffffff8")
      this.showingByClickStart=false;
      this.showingByClickEnd=false;
      this.showResult=false;
      this.showingDetailStart=false;
      this.showingDetailEnd=false;
      this.default=false;
      this.removeStartMarker("true");
      this.removeEndMarker("true");
    }
    this.changeMarker="default";
  }
  
  dragging(value){
    this.showingFavoriteAttribue=false;
    console.log(value);
    console.log(this.startPoint+","+this.endPoint);
    this.showFavorite=true;
    
    this.zone.run(()=>{
      
      if(value){
        
        this.onlymap=false;
        this.first_flag=false;
        this.result_flag=false;
        
        this.default=false;
        this.showResult=false;
        this.showSoloMap=true;
    
      }else{
        console.log("mouse up")

        if(this.changeMarker=="endMarker"){
          console.log("go end")
          this.showNextEnd=true;
          this.onlymap=true;
        }else if(this.changeMarker=="startMarker"){
          console.log("go start");
          this.showNext=true;
          console.log(this.showNext);
          this.onlymap=true;
        }
       
        
      }
    })
    
  }
  notifyingChange(v){
    console.log("vvv");
    console.log(v)
    if(v.flag==false){
      //reset
      this.first_flag=true;
      this.result_flag=false;
      this.startPoint="";
      this.endPoint="";
      this.startDetail="";
      this.endDetail="";
      this.showResult=false;
      this.showingMap=false;
      this.showMyEnd=false;
      this.showingByClickEnd=false;
      console.log("ffffffffffff9")
      this.showingByClickStart=false;
      this.showingDetailEnd=false;
      this.showingDetailStart=false;
      this.changeMarker="default";
      this.temp_flag=false;
      this.mapTopChanged=4;
      console.log("sss")
      console.log(v)
    }
    console.log("ddd")
    console.log(v)
    if(v.flag=="start"||v.flag=="end"){
      console.log("vflag"+v.flag);
      if(v.flag=="start"){
        this.showMyStart=false;
        this.showingByClickStart=true;
        this.showingByClickEnd=false;
        this.slat=v.loc.lat();
        this.slng=v.loc.lng();
        this.showingDetailStart=true;
        this.mention_detail="출발지 : "+this.startPoint;
        this.changeMarker="default";
        
      }else if(v.flag=="end"){
        this.elat=v.loc.lat();
        this.elng=v.loc.lng();
        this.showMyEnd=false;
        this.showingByClickEnd=false;
        this.showingByClickStart=true;
        this.mention_detail="출발지 : "+this.startPoint+'\n도착지 : '+this.endPoint;
        this.changeMarker="default";
        console.log(this.slat+","+this.slng+",,"+this.elat+",,,"+this.elng);
        this.showndistance=v.distance;
        console.log(this.showndistance);
        this.showingDetailEnd=true;
      }else{
        alert("resetting");

      }
      
    }
    if(this.startPoint!=undefined&&this.endPoint!=undefined){
      
      if(this.showndistance!=NaN&&this.endPoint!=""&&this.startPoint!=""){
        console.log("notifyingChange")
        this.zone.run(()=>{
          console.log(v);
          console.log("calling calculatorPrice1")
          this.calculatePrice(this.showndistance);
          this.showResult=true;
          this.default=true;
          this.showingByClickEnd=true;
          console.log("ffffff10")
          this.showingByClickStart=false;
          this.showingMap=false;
          this.default=true;
        })
        
       
      }
      
    }
  }
  calculatePrice(distance){
    this.changeMarker="default"
    if(this.startPoint!=""&&this.endPoint!=""&&this.startPoint!=undefined&&this.endPoint!=undefined){
      this.showMyStart=false;
      this.showMyEnd=false;
      this.showingByClickEnd=false;
      this.showingByClickStart=false;
      this.showingMap=false;
    }
    console.  log("calculatingPrice");
    console.log(distance);
    if(distance!=NaN&&distance!=undefined){
      console.log(distance);
      distance=distance*1000
      this.distance=distance
      if(distance<3000){
        this.price=4500;
      }else{
        var temp=distance-3000;
        var temp2=temp/100;
        var result=temp2*50;
        console.log(temp);
        console.log(temp2);
        console.log(result);
        this.price=4500+result;
        console.log(this.price);
        this.price=this.price.toFixed(0);
        console.log(this.price);
        var t1=this.price/100;
        console.log(t1);
        this.price=t1.toFixed(0);
        console.log(this.price)
        this.price=this.price*100;
        console.log(this.price)
      }
    }
   
    
  }

  ngOnChanges() {
    console.log("change"+this.test);
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add 'implements OnChanges' to the class.
    console.log("Homepage on change");
  }
  ngAfterViewInit(){
    
  }
  ngOnInit(){
  }
  cancelPickUp(){
    this.isPickupRequested=false;
  }
  confirmPickUp(){
    this.isPickupRequested=true;
  }
  getGeoCoding(){
    this.geoCode=true;
  }
  goToMyList(){
    this.navCtrl.push(ViewRequestListPage)
  }
  tapEvent(event){
    console.log(event);
  }
    calculateAndDisplayRoute() {
      console.log("sdss");
       console.log(this.afDatabase);
        var location=this.location;
        var flightPlanCoordinates=[];
        const map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat:  37.4788183, lng: 127.0516374}
        });
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
             var myLatLng = {lat: pos.lat, lng: pos.lng};
             console.log("2");
            var count=0;

             setInterval(() =>{
               console.log("starting setinterval2");
               count++;
      //         that.object('profile/user_id/'). set({massege:'haha',haha:'ns'})
      // .then(() => alert("ddssss"))
      // .catch((error)=> console.log("err : "+error))
              navigator.geolocation.getCurrentPosition(function(position){
                var pos1 = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                  
                };

                 location.lat=position.coords.latitude;
                location.lng=position.coords.longitude;
                // alert(count+": "+location.lat+","+location.lng);
                 location.lat=position.coords.latitude;
                location.lng=position.coords.longitude;
                var now=new Date();
               //that.addMapLocation(location);
                flightPlanCoordinates.push({lat:position.coords.latitude,lng:position.coords.longitude})
                var flightPlanCoordinates2 = [
          {lat:  37.478898852648925, lng: 127.05001801602016},
          {lat:  37.47854141742287, lng: 127.04825311452312},
          {lat:  37.478895414589296, lng: 127.0502639543466},
          {lat:  37.47890077067915, lng: 127.05022291557128}
        ];
        console.log("start");
        console.log(flightPlanCoordinates);
        console.log(flightPlanCoordinates2);
        var flightPath = new google.maps.Polyline({
          path: flightPlanCoordinates,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });
        myLatLng={lat:position.coords.latitude,lng:position.coords.longitude}
        console.log("myLatLng")
        console.log(myLatLng);
        
        flightPath.setMap(map);
               let marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: myLatLng
              })
             
        });
    },30000)
             let marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: myLatLng
        });
        map.setCenter(pos);
            console.log(pos.lat+"lng2222 : "+pos.lng);
          }, function(data) {
            console.log(data);
          });
        } 
      }

      addMarker(){
        console.log("sssssss");
      }


}

































