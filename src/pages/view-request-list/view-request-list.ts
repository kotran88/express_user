import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage,AlertController,ViewController,ModalController, NavController, NavParams } from 'ionic-angular';
import { HomePage } from './../home/home';
import { ChatPage } from './../chat/chat';
import { request } from './../../components/models/request';
import {FinishedPage} from './../finished/finished'
import { Subscription } from 'rxjs/Subscription';
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
  order:any;
  rmodel:any;
  dateA:any;
  dateB:any;
  items:any;
  userId:string;
  viewSetting:any;
  shown:any;
  result=[];
  request={} as request
  result_date=[];
  notification=[];
  result_pick=[];
  result_date_pick=[];
  uid:string;
  unsubscriber: Subscription = new Subscription();
  currentPoint:number;
  pointtouse:number;
  constructor(public alertCtrl: AlertController,public modalCtrl:ModalController,public afDatabase: AngularFireDatabase, public navCtrl: NavController,public viewCtrl:ViewController ,public navParams: NavParams,public afd:AngularFireDatabase) {
    
    this.uid=this.navParams.get('uid')
    var getFotos=this.afDatabase.list('profile/'+this.uid, { preserveSnapshot: true })
    getFotos.subscribe(snapshots=>{
      snapshots.forEach(element => {
        if(element.key==="id"){
            this.userId=element.val();
        }
      })
    })
    this.order="new";
    this.userId="rrr"
   this.getList("new");
  }

  getList(value){
    this.result_date=[];
    this.result=[];
    this.items=this.afd.list('/requestedList/requestedAll', { preserveSnapshot: true })
    this.items.subscribe(snapshots=>{
     snapshots.forEach(element => {
         if(element.val().user==this.userId){
          this.result_date.push(element.val().onlyDate);
          this.result.push(element.val());
          this.result_date=Array.from(new Set(this.result_date))


          //내가 배달 하는 모든 리스트를 불러옴. 
          //여기서 받은 오더번호를 가지고 메세지 노드에서 해당 오더번호의 모든 메세지를 
          //루프돈후, 아이디가 내가 아닌것의 read_flag를 확인
          //하여서 안읽은 것이 있으면 카운트를 늘려줌. 그래서 array에 push한다. 
          var eleOrderNo=element.val().orderNo;
          var messagenode=this.afd.list('/message/'+element.val().orderNo , { preserveSnapshot: true })
          messagenode.subscribe(snapshots=>{
            var count=0;
            snapshots.forEach(elements=>{
              console.log(element.val().orderNo+"!!!!"+elements.val().id+"!!!!"+this.userId);
              console.log("!?!?!?!"+element.val().orderNo);
              if(elements.val().id!=this.userId){
                if(elements.val().read_flag=="false"){

                  count++;
                }

                console.log(elements.val().read_flag)
              }
            })
            console.log(this.notification)
            for(var i=0; i<this.notification.length; i++){
              if(this.notification[i].orderNo==element.val().orderNo){
                console.log(i+"번째 삭제")
                this.notification.splice(i,1);
              }
            }
            this.notification.push({"orderNo":element.val().orderNo,"value":count});
            this.notification=Array.from(new Set(this.notification))
            
         })

        }
     })
    })
    if(value=="old"){
      this.result_date.sort(function(a,b){
        let dateA = +new Date(a);
         let dateB = +new Date(b);
        return dateA-dateB;
      })
    }else if(value=="new"){
      this.result_date.sort(function(a,b){
        let dateA = +new Date(a);
         let dateB = +new Date(b);
        return dateB-dateA;
      })
    }
  }
  orderchanged(){
    if(this.order!=undefined){

      this.getList(this.order);
    }
  }
  review(item){
    let modal = this.modalCtrl.create(FinishedPage,{itemObject:item});
    let me = this;
    modal.onDidDismiss(data => {
    });
    modal.present();
  }
  viewPickup(){
   this.sorting("pickup");
  }
  viewRequested(){
    this.sorting("requested");
  }
  viewAssigned(){
    this.sorting("assigned");
  }
  viewFinished(){
    this.sorting("finished")
  }

  cancel(item,flag){
    
        
    if(flag=="requested"){
      this.afDatabase.object('/requestedList/requested/'+item.orderNo).remove();
      this.afDatabase.object('/requestedList/requestedAll/'+item.orderNo).remove();
      this.afDatabase.object('/requestedList/cancelled/'+item.orderNo).set(item).then((success)=>{
        alert("취소되었습니다.")
        console.log(item);
         //취소와 함께 포인트 복구
         var currentPoint=0;
         var pointtoadd=(item.distance*1000)*0.05;
         var getcurrentPoint=this.afDatabase.list('/profile/'+this.uid+'/point/', { preserveSnapshot: true })
         this.unsubscriber=getcurrentPoint.subscribe(snapshots=>{
          snapshots.forEach(element => {
              if(element.key=="value"){
                 currentPoint=element.val();
                  console.log("point:"+element.val());
                  this.unsubscriber.unsubscribe();
                  var pointt=this.afDatabase.object('profile/'+this.uid+'/point/')
                  pointt.update({
                      value:(currentPoint+pointtoadd)
                  }).then(()=>{
                  })
              }
             })
         });
        this.getList("new")
       })
      
    }else if(flag=="assigned"){
      var list=[];
        list.push({type:'radio',label:"너무 늦어요!",value:"late"})
        list.push({type:'radio',label:"보낼 필요가 없어졌어요!",value:"nocause"})
        list.push({type:'radio',label:"다른 기사로 변경을 원해요!",value:"change"})
        list.push({type:'radio',label:"기타이유(작성)!",value:"etc"})
      let prompt = this.alertCtrl.create({
        title: '취소',
        message: '취소 이유를 알려주세요!',
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
             
            if(data=="etc"){
              console.log("clicked etc")
              setTimeout(()=>{
                this.promptReason(item);
              },500)
            }else{
              item.reason=data.cause;
              console.log(item);
              this.afDatabase.object('/requestedList/requested/'+item.orderNo).remove();
              this.afDatabase.object('/requestedList/requestedAll/'+item.orderNo).remove();
              this.afDatabase.object('/requestedList/cancelled/'+item.orderNo).set(item).then((success)=>{
              this.viewCtrl.dismiss()
            })
          }
           }
         }
        ]
        });
            prompt.present();
      
    }

  }
  promptReason(item){

    let alert2 = this.alertCtrl.create({
      title: '취소 사유를 입력해주세요',
      inputs: [
        {
          name: 'cause',
          placeholder: '취소 사유를 입력해주세요'
        }
      ],
      buttons: [
        
        {
          text: '확인',
          handler: data => {
            console.log(data.cause);
            item.reason=data.cause;
            console.log(item);
            this.afDatabase.object('/requestedList/requested/'+item.orderNo).remove();
            this.afDatabase.object('/requestedList/requestedAll/'+item.orderNo).remove();
            this.afDatabase.object('/requestedList/cancelled/'+item.orderNo).set(item).then((success)=>{
            this.viewCtrl.dismiss()
            })

          }
        }
      ]
    });
    alert2.present();
  }
  changed2(){
    switch (this.rmodel) {
      case "pickup":
        this.sorting("pickup")
        break;
      case "requested":
        this.sorting("requested");
        break;
      case "assigned":
        this.sorting("assigned");
        break;
      case "finished":
       this.sorting("finished")
       break;
      case "all":
      this.sorting("all")
      break;
      default:
        break;
    }
  }
  sorting(value){
    this.result_date=[];
    this.result=[];
    var items=this.afd.list('/requestedList/requestedAll', { preserveSnapshot: true })
    console.log("snapshot????????????????????????????")
    if(value=="all"){
      this.getList("new");
    }else{
      items.subscribe(snapshots=>{
        console.log(snapshots);
     
        snapshots.forEach(element => {
          console.log("key value");
          console.log(element.key);
            console.log(element.val());
            console.log(element.val().user+",,,"+this.userId);
            if(element.val().user==this.userId&&element.val().status==value){
             this.result_date.push(element.val().onlyDate);
             this.result.push(element.val());
             this.result_date=Array.from(new Set(this.result_date))
           }
        })
       })
    }
   
  }
  chat(itemObject){
    console.log(itemObject);
    this.navCtrl.push(ChatPage,{item:itemObject})
  }
  confirm(itemObject){
    this.request=itemObject;
    this.request.status="finished";
    this.afDatabase.object('/requestedList/assigned/'+itemObject.orderNo).remove();
    this.afDatabase.object('/requestedList/finished/'+itemObject.orderNo).set(this.request);
    this.afDatabase.object('/requestedList/requestedAll/'+itemObject.orderNo).set(this.request);
  }
  goBack(){
    this.navCtrl.setRoot(HomePage)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRequestListPage');
  }

}
