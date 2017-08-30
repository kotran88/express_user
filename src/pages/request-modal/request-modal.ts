import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Platform,ViewController} from 'ionic-angular';
import { request } from './../../components/models/request';

import { AngularFireDatabase } from 'angularfire2/database';
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
export class RequestModalPage {
  start:string;
  end:string;
  img_forward:string;
  img_backward:string;
  content:string;
  weight:string;
  size:string;
  type:string;
  request={} as request
  distance:string;
  location:any;
  it:any;
  totalNumber:any;
  request_text:string;
  userId:string;
  constructor(public viewCtrl:ViewController ,public navCtrl: NavController,public platform:Platform,public afDatabase:AngularFireDatabase, public navParams: NavParams) {
    this.start=this.navParams.get("start");
    this.end=this.navParams.get("end");
    this.distance=this.navParams.get("dis");
    this.location=this.navParams.get("location");
    var id=localStorage.getItem("id");
    if(id!=undefined||id!=null){
    this.userId=id;
    }else{
    this.userId="admin"
    }
    this.it=this.afDatabase.list('/requestedList/requestedAll', { preserveSnapshot: true })
    this.it.subscribe(snapshots=>{
      this.totalNumber=snapshots.length;
     
    })
    if(this.img_forward==undefined){
      this.img_forward="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";
      this.img_backward="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png";
    }

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
  confirm(){
          
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
            let todayNoTime= yyyy+" "+mm+" "+dd;
            let todayNoTime2=yyyy+'/'+month+'/'+day;
          let todayWithTime = yyyy+'/'+month+'/'+day+' '+time;
              let todayWithTime2 = yyyy+'/'+month+'/'+day;

          this.request.endLat=this.location.endlat;
          this.request.endLng=this.location.endlng;
          this.request.startLat=this.location.startlat;
          this.request.startLng=this.location.startlng;

          this.request.user=this.userId;
          this.request.create_date=todayWithTime;
          this.request.status="requested";
          this.request.startPoint=this.start;
          this.request.endPoint=this.end;
          this.request.onlyDate=todayNoTime2;
          
          this.request.freight_content=this.content;
          this.request.freight_size=this.size;
          this.request.freight_weight=this.weight;
          this.request.request_text=this.request_text;
          
          
          
          var orderNo=yyyy+month+day+'0000'+this.totalNumber;
          this.request.orderNo=orderNo;
          if(this.platform.is('android')){
              window["plugins"].OneSignal.getIds((idx)=>{
               this.request.tokenId=idx.userId
               this.afDatabase.object('/requestedList/requestedAll/'+orderNo).set(this.request).then((suc)=>{
              }).catch((error)=>{
                alert(error)
              })
              this.afDatabase.object('/requestedList/requested/'+orderNo).set(this.request).then((success)=>{
               alert("신청이 완료되었습니다.")
               
               this.viewCtrl.dismiss();
               
           }).catch((error)=>{
             alert(error);
           })
            })
            }else{
              alert("not applicable to web")
              console.log("this.request");
              console.log(this.request);
              
            }
  }
  

}
