import { SimulateProvider } from './../providers/simulate/simulate';
import { NotifiedPage } from './../pages/notified/notified';
import { FinishedPage } from './../pages/finished/finished';
import { HomePage } from './../pages/home/home';
import { Http,Headers ,RequestOptions} from '@angular/http';
import { request } from './models/request';
import { AngularFireDatabase } from 'angularfire2/database';
import { PickupCar } from './pickup-car/pickup-car';
import { CarProvider } from './../providers/car/car';
import { PickupDirective } from './../pickup/pickup';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit,Injectable, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { NavController, LoadingController, ToastController,Platform,AlertController, ModalController, NavParams } from 'ionic-angular';
import { AvailbleCarDirective } from './available-cars/available-cars';
import { Geolocation } from '@ionic-native/geolocation';
import { Dialogs } from '@ionic-native/dialogs';
import { OneSignal } from '@ionic-native/onesignal';
import { Subscription } from 'rxjs/Subscription';
import { MetroServiceProvider } from './../providers/metro-service/metro-service';

declare var google;

@Component({
   selector: 'map',
  templateUrl: 'map.html',
   entryComponents: [PickupDirective,AvailbleCarDirective,PickupCar],
     providers:[CarProvider,PickupDirective]
})
export class MapDirective implements OnInit,OnChanges  {
    station:any;
    station_distance:number;
  unsubscriber: Subscription = new Subscription();
    latOnly:any;
    lngOnly:any;
    public simulate:SimulateProvider;
    flag:string="startMarker";
    centerMarker=[];
    count_number:number=0;
    notifyingChangevalue:boolean=false;
    startlat:any;
    startlng:any;
    endlat:any;
    endlng:any;
    slat:any;
    elat:any;
    slng:any;
    elng:any;
    //mouseup될때 좌표저장.
    @Input() resetEnddd:any;
    @Input() resetStarttt:any;
    @Input() panningToMiddle:any;
    @Input() panningLocation:any;
    @Input() makeMarkerInformation:any;
    @Input() makeMarker:string;
    @Input() resetStartt:any;
    @Input() resetEndd:any;
    @Input() resetStart:any;
    @Input() resetEnd:boolean;
    @Input() resetAll:any;
    @Input() changeMarker:any;    
    @Input() deliverer_location:any;
    @Input() panTodeliveryGuy:any;
    @Input() isPickupRequested:any;
    @Input() startstn:string;
    @Input() endstn:string;
    @Input() startLng:any;
    @Input() startLat:any;
    @Input() endLng:any;
    @Input() endLat:any;
    @Input() fetchingExpress:any;
    @Input() deliveryGuy:any;
    start_list=[];
    result_metro=[];
    end_list=[];
    @Output() mapIsCreated : EventEmitter<any>=new EventEmitter();
    @Output() start : EventEmitter<any>=new EventEmitter();
    @Output() end : EventEmitter<any>=new EventEmitter();
    @Output() count : EventEmitter<any>=new EventEmitter();
    @Output() favorite : EventEmitter<any>=new EventEmitter();
    @Output() starting : EventEmitter<any>=new EventEmitter();
    @Output() ending : EventEmitter<any>=new EventEmitter();
    @Output() dragging : EventEmitter<any>=new EventEmitter();
    @Output() startLocation : EventEmitter<any>=new EventEmitter();
    @Output() endLocation : EventEmitter<any>=new EventEmitter();
    @Output() notifyingChange: EventEmitter<any>=new EventEmitter();
    @Output() sLat : EventEmitter<any>=new EventEmitter();
    @Output() sLng : EventEmitter<any>=new EventEmitter();
    @Output() eLat : EventEmitter<any>=new EventEmitter();
    @Output() eLng : EventEmitter<any>=new EventEmitter();

    @Output() new_address : EventEmitter<any>=new EventEmitter();
    @Output() full_address : EventEmitter<any>=new EventEmitter();
    public refreshing:boolean=false;
    public map:any;
    public isMapIdle:boolean;
    public currentLocation:any;
    public full="";
    favorite_information=[];
    centerMarker_array=[];
    circleMarker:any;
    lat:number;
    lng:number;
    tokenid:string;
    @Input() requested:boolean;
    requestedRoute=[];
      items:any;
    Marker:any;
    MarkerEnd:any;
    MarkerStart:any;
     markerStart=[];
     request={} as request
     markerEnd=[];
     geocoder:any;
     start_end:boolean=false;
     startMarker=[];
     endMarker=[];
     userId:string;
     uid:string;
    constructor(public metro:MetroServiceProvider,public sim:SimulateProvider, public toast:ToastController, public loading:LoadingController,public platform:Platform, public http:Http, 
        private alertCtrl:AlertController,public pick:PickupDirective,public geo:Geolocation,
        public afDatabase:AngularFireDatabase,public modal:ModalController
  ){
//      
// 
this.uid=localStorage.getItem("uid");
if(this.uid==""||this.uid==undefined){
  this.uid="evCJcw2WnGWlwUcFVk1K1kHVQzJ2"
}
console.log("uid : "+this.uid);
  
//  let headers = new Headers({ 'Authorization': 'Bearer Xw8t8tVjgtT0t--jRrsD7oFqZEq2AFBIjF9XSwoqAuYAAAFdv6Kaqg' });
// let options = new RequestOptions({ headers: headers });
//   this.http.get('https://kapi.kakao.com/v1/user/me', options).toPromise().then((res)=>{
//       console.log(res.json())
//       alert(res.json());
//   }).catch((error)=>{
//     alert(error);
// })
 
    // 
var notificationOpenedCallback = function(jsonData) {
console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
};
   
    var id=localStorage.getItem("id");
    if(id!=undefined||id!=null){
    this.userId=id;
    }else{
    this.userId="admin"
    }
     
    var favorate_list=this.afDatabase.list("profile/"+this.uid+"/favorite", {preserveSnapshot:true})
    favorate_list.subscribe(snapshots=>{
      this.favorite_information=[];
      
      snapshots.forEach(element=>{
        this.favorite_information.push(element.val());
      })
      console.log(this.favorite_information.length);
      console.log(this.favorite_information[0]);
      console.log("hai")
      this.favorite.next(this.favorite_information);
    })

    
    
    //       window["plugins"].OneSignal
    // .startInit("2192c71b-49b9-4fe1-bee8-25617d89b4e8", "916589339698")
  	// .handleNotificationOpened(notificationOpenedCallback)
    // .endInit();
    }
    
  ionViewDidLoad(){

  }
  ionViewDidEnter(){
  }
  locator(value){
    
      
     
      if(value=="start"){
        this.getGeoCoding(this.latOnly,this.lngOnly,"start");
      }else if(value=="end"){
       
      }
  }
    createMarkerForStart(location){
         this.Marker=new google.maps.Marker({
            map : this.map,
            position:location,
            icon:'assets/icon/start2.png'
        })
        this.markerStart.push(this.Marker)
        if(this.markerStart.length>1){
            for(var i=0; i<this.markerStart.length; i++){

                if(this.markerStart.length-1==i){

                }else{
                    this.markerStart[i].setMap(null);
                }
            }
        }
    }
    createMarkerForEnd(location){
         this.Marker=new google.maps.Marker({
            map : this.map,
            position:location,
            icon:'assets/icon/end.png'
        })
        this.markerEnd.push(this.Marker)
        
                  var flightPlanCoordinates=[
           
        ];
        
        if(this.markerEnd.length>1){
            for(var i=0; i<this.markerEnd.length; i++){

                if(this.markerEnd.length-1==i){
                    
                }else{
                    this.markerEnd[i].setMap(null);
                }
            }
        }
    }
    resetMarker(){
        console.log("reset");
        console.log(this.startMarker);
        console.log(this.endMarker);
        for(var i=0; i<this.startMarker.length; i++){
            this.startMarker[i].setMap(null);
            
        }
        this.startMarker=[];
        for(var i=0; i<this.endMarker.length; i++){
            this.endMarker[i].setMap(null);
        }
        this.endMarker=[];
       console.log("deleted")
        this.notifyingChange.next({flag:false})
        if(this.map!=undefined){
            console.log("deleted2")
            console.log(this.currentLocation)
            if(this.currentLocation!=undefined){
                this.map.panTo(this.currentLocation)
                this.map.setZoom(15)
            }
        }
        console.log("deleted3")
    }
    resetStartMarker(value){
        if(this.startMarker!=undefined){
            if(this.startMarker.length!=0){
                console.log("length : "+this.startMarker.length);
                if(value==true){
                    console.log(this.startMarker.length+"중 마지막을지운다.");
                    this.startMarker[this.startMarker.length-1].setMap(null);
                }else if(value=="confirm"){
                    for(var i=0; i<this.startMarker.length; i++){
                        if(i!=(this.startMarker.length-1)){
                            console.log(i+"s delete");
                            this.startMarker[i].setMap(null);
                        }
                    }
                }
                
            }
        }
    }
    resetEndMarker(value){
        if(this.endMarker!=undefined){
            if(this.endMarker.length!=0){
                console.log("length : "+this.endMarker.length);
                if(value==true){
                    console.log(this.endMarker.length+"endmarker 중 마지막을지운다.");
                    this.endMarker[this.endMarker.length-1].setMap(null);
                }else if(value=="confirm"){
                    for(var i=0; i<this.endMarker.length; i++){
                        if(i!=(this.endMarker.length-1)){
                            console.log(i+"s delete");
                            this.endMarker[i].setMap(null);
                        }
                    }
                }
                
            }
        }
    }
    getAjacentStation(start,end){
        var total=[];
        var distance=[];
        var min_distance
        start=37.497945;
        end=127.027621;
        var result_metro=this.metro.getMetro().subscribe(data=>{
            this.result_metro=data;
             for(var i=0; i<this.result_metro.length; i++){
 
               var distance1 = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.result_metro[i].XPOINT_WGS,this.result_metro[i].YPOINT_WGS),
                new google.maps.LatLng(start,end));  
                distance1=(parseInt(distance1)/1000);
                distance.push(distance1)
                total.push({name:this.result_metro[i].STATION_NM,dis:distance})
                min_distance=Math.min.apply( Math, distance );
 
             }
             for(var j=0; j<total.length; j++){
               if(total[j].dis==min_distance){
                 console.log(total[j]);
                 console.log("same")
                 this.station=total[j]
               }
             }
             this.station_distance=min_distance;
             console.log(min_distance)
 
           });
    }
    ngOnChanges() {
        console.log("this.makeMarker");
        console.log(this.makeMarker);
        if(this.makeMarker=="start"){
            console.log("makeMarker");
            
            console.log(this.makeMarkerInformation)
            
            var loc=new google.maps.LatLng(this.makeMarkerInformation.lat,this.makeMarkerInformation.lng);
            this.checkIfStartExistThenDelete();
            var startMarker=new google.maps.Marker({
              map : this.map,
              position:loc,
              icon:'assets/icon/start2.png'
          })
          console.log(loc);
          console.log(this.makeMarkerInformation.lat+",,,"+this.makeMarkerInformation.lng)
          this.startMarker.push(startMarker);
          this.map.panTo(loc)
          this.makeMarker="s"
        }else if(this.makeMarker=="end"){
            console.log("makeMarkerend");
            console.log(this.makeMarkerInformation)
            
            var loc=new google.maps.LatLng(this.makeMarkerInformation.lat,this.makeMarkerInformation.lng);
            this.checkIfEndExistThenDelete();
            var endMarker=new google.maps.Marker({
              map : this.map,
              position:loc,
              icon:'assets/icon/end.png'
          })
          this.endMarker.push(endMarker);
          this.map.panTo(loc)
          console.log(loc);
          console.log(this.makeMarkerInformation.lat+",,,"+this.makeMarkerInformation.lng)
          this.makeMarker="e"
        }
        console.log("mapngchanges3")
        console.log(this.resetAll);
       if(this.resetAll==true||this.resetAll==false){
           this.resetMarker();
           this.resetAll="undefined"
       }
        console.log("resetStart:"+this.resetStart);
        console.log(this.resetStartt);
        if(this.resetStart==true||this.resetStart==false){
            console.log("reststartmarker"+this.resetStartt)
            if(this.resetStartt==true||this.resetStartt==false){
                console.log("start eliminate")
                this.checkIfStartExistThenDelete()
                this.resetStartt="ffff";
            }
          
        }

        if(this.resetStarttt==true||this.resetStarttt==false){
            this.resetStartMarker("confirm")
            console.log("하나빼고 다지움");
            this.resetStarttt="f";
        }
        if(this.resetEnddd==true||this.resetEnddd==false){
            this.resetEndMarker("confirm");
            this.resetEnddd="t";
        }
        if(this.resetEnd==true||this.resetEnd==false){
            console.log("restEndmarker"+this.resetStartt)
            if(this.resetEndd==true||this.resetEndd==false){
                this.resetEndMarker(true);
                this.resetEndd="ff";
            }else if(this.resetEndd=="confirm"){
                this.resetEndMarker("confirm")
            }
        }
        this.flag=this.changeMarker
      
        if(this.deliverer_location!=undefined){
            //유저가 배달원의 위치를 볼수 있도록 pan To 한다. 
            var location=new google.maps.LatLng(this.deliverer_location.lat,this.deliverer_location.lng);
            this.map.panTo(location);
        }
        
        if(this.startLat!=undefined||this.startLat!=null){
            let location2={lat:this.startLat,lng:this.startLng};
            this.centerLocation(location2);
           this.createMarkerForStart(location2);
        }

        if(this.endLat!=undefined||this.endLat!=null){
            let location={lat:this.endLat,lng:this.endLng};
            this.centerLocation(location);
            this.createMarkerForEnd(location);
        }

        console.log("map changed");
        console.log(this.startstn+","+this.endstn);
        if(this.panningToMiddle==true||this.panningToMiddle==false){
            console.log(this.panningLocation);
            console.log("hihihi")
            var loc=new google.maps.LatLng(this.panningLocation[0].lat()*0.998,this.panningLocation[0].lng());
            var bounds = new google.maps.LatLngBounds();
            console.log(loc)
            var distance=this.panningLocation[1];
            console.log(distance);
          

            if(this.panningLocation.length>1){
                //즐겨찾기 인경우에 3,4번째 패러미터로 startLocation endLocation좌표가 넘어옴
                var startMarker=new google.maps.Marker({
                    map : this.map,
                    position:this.panningLocation[2],
                    icon:'assets/icon/start2.png'
                })
          
                this.startMarker.push(startMarker);

                var endMarker=new google.maps.Marker({
                    map : this.map,
                    position:this.panningLocation[3],
                    icon:'assets/icon/end.png'
                })
          
                this.endMarker.push(endMarker);
            }
            console.log(this.startMarker);
            console.log(this.startMarker.length);
            console.log(this.endMarker);
            console.log(this.endMarker.length);
            if(this.startMarker!=undefined){
                for(var i=0; i<this.startMarker.length; i++){
                    console.log(i+"q")
                    console.log(this.startMarker[i].position);
                    console.log(this.endMarker[i].position)
                }
            }
            var loc=new google.maps.LatLng(this.startMarker[0].position.lat(),this.startMarker[0].position.lng())
            var loc2=new google.maps.LatLng(this.endMarker[0].position.lat(),this.endMarker[0].position.lng())


            bounds.extend(loc);
            bounds.extend(loc2)
            console.log(bounds);
            console.log(bounds.b);
            console.log(bounds.sc);
            this.map.fitBounds(bounds);
            console.log(this.map);
            console.log(this.map.getCenter());
            console.log(this.map.getCenter().lat())
           
            console.log("panningToMiddle");
            if(distance<1){
                var newloc=new google.maps.LatLng(this.map.getCenter().lat(),this.map.getCenter().lng())
                this.map.setCenter(newloc);
                this.map.setZoom(14);
            }else if(distance<3){
                var newloc=new google.maps.LatLng(this.map.getCenter().lat()*0.9998,this.map.getCenter().lng())
                this.map.setCenter(newloc);
                this.map.setZoom(13);
            }else if(distance<5){
                console.log("5km")
                var newloc=new google.maps.LatLng(this.map.getCenter().lat(),this.map.getCenter().lng())
                this.map.setCenter(newloc);
                this.map.setZoom(13);
            }else if(distance<7){
                console.log("5.xkm")
                var newloc=new google.maps.LatLng(this.map.getCenter().lat(),this.map.getCenter().lng())
                this.map.setCenter(newloc);
                this.map.setZoom(12);
            }else{
                console.log("more than 7km")
                var newloc=new google.maps.LatLng(this.map.getCenter().lat()*0.999,this.map.getCenter().lng())
                this.map.setCenter(newloc);
                this.map.setZoom(11);
            }
            this.panningToMiddle="p"
                          
        }
    }
    calling(){

    }
   

    ngOnInit(){
        
        
        var count=this.afDatabase.list('/requestedList/requestedAll', { preserveSnapshot: true })
        count.subscribe(snapshots=>{
      
         snapshots.forEach(element => {
             if(element.val().user==this.userId){
                 this.count_number++;
            }
         })
         this.count.next(this.count_number);
        });

        var start=this.afDatabase.list('profile/'+this.uid+'/start', { preserveSnapshot: true })
        
        start.subscribe(snapshots=>{
            this.start_list=[];
         snapshots.forEach(element => {
             this.start_list.push(element.val());
         })
         this.start_list=Array.from(new Set(this.start_list))
         
         this.start_list.sort(function(a,b){
            let dateA = +new Date(a.searchedTime);
             let dateB = +new Date(b.searchedTime);
            return dateB-dateA;
         })
         for(var i=1; i<this.start_list.length; i++){
            this.start_list.splice(i,1);
         }
         
         this.start.next(this.start_list);
        });

        var end=this.afDatabase.list('profile/'+this.uid+'/end', { preserveSnapshot: true })
        
        end.subscribe(snapshots=>{
            this.end_list=[];
         snapshots.forEach(element => {
             this.end_list.push(element.val());
         })
         this.end_list=Array.from(new Set(this.end_list))
         this.end_list.sort(function(a,b){
            let dateA = +new Date(a.searchedTime);
             let dateB = +new Date(b.searchedTime);
            return dateB-dateA;
         })
         for(var i=1; i<this.end_list.length; i++){
           this.end_list.splice(i,1);
        }
         this.end.next(this.end_list);
        });
        this.map=this.createMap();
        // var current=localStorage.getItem("currentPosition");
        // var lat=localStorage.getItem("lat");
        // var lng=localStorage.getItem("lng");
        
        // console.log(current);
        // console.log(lat+","+lng);
        // if(current=="true"){
        //     //localstorage 에 현위치가 저장되어있으면 그것을 가져와서 노출시킨다.
        //     var image = {
        //         url: 'https://firebasestorage.googleapis.com/v0/b/ionic-173108.appspot.com/o/7e194ccf-e864-4206-aecf%2Fitsme.sketch?alt=media&token=84fe7679-49ac-45b3-a0cc-3182eeb067e0',
        //         size: new google.maps.Size(15, 17),
        //       };
        //     console.log("true!")
        //     this.checkIfCenterMarkerExist();
        //     var centerMarker=new google.maps.Marker({
        //         map: this.map,
        //         icon:image,
        //         position: new google.maps.LatLng(lat, lng),
        //       })
        //       this.centerMarker_array.push(centerMarker);
        //       console.log(centerMarker)
        //       console.log("?1")
        //       var loc=new google.maps.LatLng(lat,lng);
        //       this.map.panTo(loc)
        // }else{
            this.getCurrentLocation2().subscribe(currentLocation=>{
                
             });
        // }
        
    }
centerLocation2(){
    this.isMapIdle=false;
    this.getCurrentLocation2().subscribe(currentLocation=>{
     this.map.panTo(currentLocation);    
        
    });
}
centerLocation(location){
    if(location){
            this.map.panTo(location);
    }else{
        this.isMapIdle=false;
        this.getCurrentLocation2().subscribe(currentLocation=>{
         this.map.panTo(currentLocation);    
        });
    }
  }
  
//   updatedPickupLocation(location){
//     this.currentLocation=location;
//     this.centerLocation(location);
//   }
  addMapEventListener(){
    
    // google.maps.event.addListener(this.map,'idle',(event)=>{
    //     console.log("idle"+event);
    //     console.log(this.refreshing);
    //     if(this.refreshing){
    //         this.refreshing=false;
    //     }
    //     this.isMapIdle=true;
      
    // })
    
   


   
  }
  checkIfStartExistThenDelete(){
      console.log(this.startMarker.length);
      if(this.startMarker!=undefined){
        for(var i=0; i<this.startMarker.length;i++){
            this.startMarker[i].setMap(null);
        }
      }
  }
  checkIfEndExistThenDelete(){
    if(this.endMarker!=undefined){
      for(var i=0; i<this.endMarker.length;i++){
          this.endMarker[i].setMap(null);
      }
    }
}
getResult(v,flag,results){
    console.log(results[0].geometry.location.lat()+",,,"+results[0].geometry.location.lng())
    console.log(flag);
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
     var todayNoTime=month+'/'+day;
    console.log("getResult!");
    if(flag=="start"){
        console.log("start selected")
        this.startlat=results[0].geometry.location.lat();
        this.startlng=results[0].geometry.location.lng()
        var loc=new google.maps.LatLng(this.startlat,this.startlng);
        this.checkIfStartExistThenDelete();
        var startMarker=new google.maps.Marker({
          map : this.map,
          position:loc,
          icon:'assets/icon/start2.png'
      })

      this.startMarker.push(startMarker);
      this.map.panTo(loc)
      
      console.log("list");
      console.log(this.start_list);
      var match_flag=false;
      //즐겨찾기에 추가한다.
      if(this.start_list.length==0){
          //첫 추가
        console.log("just add");
        this.afDatabase.list("profile/"+this.uid+"/start").push({lat:this.startlat,lng:this.startlng,place:v,searchedTime:todayNoTime}).then(()=>{
          
        }).catch((error)=>{
        });
      }else{
          //리스트에 즐겨찾기가 있다면, 조회해서 일치하는 것이 있으면 업데이트한다. 
          //일치하는것이 없다면, 추가. 
                var key="";
                var list=this.afDatabase.list('profile/'+this.uid+'/start', {preserveSnapshot:true});
                list.subscribe(snapshots=>{
                    snapshots.forEach(element=>{
                        console.log("element.val()"+element.val());
                        if(element.val().place==v){
                            console.log("matched");
                            match_flag=true;
                            console.log(element.key);
                            key=element.key;
                            
                        }
                    })
                   
                })
                
            if(match_flag){
                var updating=this.afDatabase.object('profile/'+this.uid+'/start/'+key)
                updating.update({
                    searchedTime:todayNoTime
                })
            }
            if(!match_flag){
                console.log("just add");
                this.afDatabase.list("profile/"+this.uid+"/start").push({lat:this.startlat,lng:this.startlng,place:v,searchedTime:todayNoTime}).then(()=>{
                  
                }).catch((error)=>{
                });
            }
      }
      
      
      }else{
        console.log("end selected")
      this.endlat=results[0].geometry.location.lat();
      this.endlng=results[0].geometry.location.lng();
      var loc=new google.maps.LatLng(this.endlat,this.endlng);
      this.checkIfEndExistThenDelete();
      var endMarker=new google.maps.Marker({
          map : this.map,
          position:loc,
          icon:'assets/icon/end.png'
      })
      this.endMarker.push(endMarker);
      this.map.panTo(loc)
      var match_flag_end=false;
      //즐겨찾기에 추가한다.
      if(this.end_list.length==0){
          //첫 추가
        console.log("just adddd");
        this.afDatabase.list("profile/"+this.uid+"/end").push({lat:this.endlat,lng:this.endlng,place:v,searchedTime:todayNoTime}).then(()=>{
          
        }).catch((error)=>{
        });
      }else{
          //리스트에 즐겨찾기가 있다면, 조회해서 일치하는 것이 있으면 업데이트한다. 
          //일치하는것이 없다면, 추가. 
                var key="";
                var list=this.afDatabase.list('profile/'+this.uid+'/end', {preserveSnapshot:true});
                list.subscribe(snapshots=>{
                    snapshots.forEach(element=>{
                        console.log("element.val()"+element.val());
                        console.log(element.val());
                        if(element.val().place==v){
                            console.log("matched");
                            match_flag_end=true;
                            console.log(element.key);
                            key=element.key;
                            
                        }
                    })
                   
                })
                
            if(match_flag_end){
                var updating=this.afDatabase.object('profile/'+this.uid+'/end/'+key)
                updating.update({
                    searchedTime:todayNoTime
                })
            }
            if(!match_flag_end){
                console.log("just add");
                console.log(this.endlat+","+this.endlng+",,"+v+",,,"+todayNoTime)
                this.afDatabase.list("profile/"+this.uid+"/end").push({lat:this.endlat,lng:this.endlng,place:v,searchedTime:todayNoTime}).then(()=>{
                  
                }).catch((error)=>{
                });
            }
      }
      
      
    }
    console.log(this.startlat+",,"+this.startlng+"!!"+this.endlat+"??"+this.endlng)
    var showndistance=this.getdistance(this.startlat,this.startlng,this.endlat,this.endlng);
    var loc=new google.maps.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng())
    console.log(results[0].geometry.location.lat()+"!"+results[0].geometry.location.lng())
    
      console.log(showndistance);
     this.notifyingChangevalue=!this.notifyingChangevalue;
     this.notifyingChange.next({distance:showndistance,flag:flag,loc:loc});
    
}
  geocoding(v,flag){
     
    var service = new google.maps.places.AutocompleteService();
    var location=new google.maps.Geocoder();
    let me = this;
    service.getPlacePredictions({ input: v,  componentRestrictions: {country: 'Kr'} }, function (predictions, status) {
        console.log(predictions);
        console.log(status);
        console.log("getttttttt");
          if(predictions!=null){
              console.log("ll:")
              console.log(predictions.length);
            predictions.forEach(function (prediction) {
          });
          }else{
            console.log("prediction == null"+predictions);
          }
          
      });
      location.geocode({'address':v},(results,status)=>{
        if(status=='OK'){
          console.log("result:")
         console.log(results);
            this.getResult(v,flag,results);
          
        }
        })
  }
  getdistance(slat,slng,elat,elng){
    var showndistance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(this.startlat, this.startlng),
    new google.maps.LatLng(this.endlat, this.endlng));  
    showndistance=parseInt(showndistance);
    showndistance=showndistance/1000

    return showndistance;
    }

  
  getGeoCoding(lat,lng,flag){

    let request = {
              latLng: {lat:lat,lng:lng}
            };  
        var location=new google.maps.LatLng(lat,lng);
        this.geocoder=new google.maps.Geocoder();
        this.geocoder.geocode(request,  (results, status) => {
                    if (status == google.maps.GeocoderStatus.OK) {
                      if (results[0] != null) {
                                         
                       let city=results[0].address_components[results[0].address_components.length-3].short_name; 
                       let gu = results[0].address_components[results[0].address_components.length-4].short_name;    
                       let dong=results[0].address_components[results[0].address_components.length-5].short_name; 
                       let detail=results[0].address_components[results[0].address_components.length-6].short_name; 
                       var address=gu+" "+dong+" "+detail;
                       console.log(address);
                       var sending={address:address,slat:lat,slng:lng,flag:flag}
                       
                       if(flag=="start"){
                        var startMarker=new google.maps.Marker({
                            map : this.map,
                            position:location,
                            icon:'assets/icon/start2.png'
                        })
                        this.startMarker.push(startMarker);
                       }else if(flag=="end"){
                        var endMarker=new google.maps.Marker({
                            map : this.map,
                            position:location,
                            icon:'assets/icon/end.png'
                        })
                        this.map.panTo(location);

                        this.endMarker.push(endMarker);
                       }
                       this.full_address.next(sending);
                      } else {
                        alert("No address available");
                      }
                    }
                  });
   
}
    createMap(location=new google.maps.LatLng(37.5665,126.9780)){
        let mapOptions={
            center:location,
            zoom:15,
            mapTypeControl: false,
            
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            scaleControl: false,
            streetViewControl: false,
            
            fullscreenControl: false
        }
        let mapEl=document.getElementById('map');
        let map=new google.maps.Map(mapEl,mapOptions);
        google.maps.event.addListener(map,'zoom_changed',(event)=>{
            // alert(map.getZoom());
            //zoom detect
        })
        google.maps.event.addListener(map,'dragstart',(event)=>{
            this.dragging.next(true);
        })
        google.maps.event.addListener(map,'dragend',(event)=>{
            this.dragging.next(false);
            let request = {
                latLng: {lat:map.getCenter().lat(),lng:map.getCenter().lng()}
              };  
              var location=new google.maps.LatLng(map.getCenter().lat(),map.getCenter().lng());
            this.geocoder=new google.maps.Geocoder();
            this.geocoder.geocode(request,  (results, status) => {
                        if (status == google.maps.GeocoderStatus.OK) {
                          if (results[0] != null) {
                                             
                           let city=results[0].address_components[results[0].address_components.length-3].short_name; 
                           let gu = results[0].address_components[results[0].address_components.length-4].short_name;    
                           let dong=results[0].address_components[results[0].address_components.length-5].short_name; 
                           let detail=results[0].address_components[results[0].address_components.length-6].short_name; 
                           var address=dong+" "+detail;
                           console.log(address);
                           console.log(this.flag);
                           if(this.flag=="startMarker"){
                                var startMarker=new google.maps.Marker({
                                    map : map,
                                    position:location,
                                    icon:'assets/icon/start2.png'
                                })
                                this.startMarker.push(startMarker);
                                console.log(this.startMarker);
                                this.startlat=map.center.lat();
                                this.startlng=map.center.lng();
                           }else if(this.flag=="endMarker"){
                               console.log("endmarker");
                             var endMarker=new google.maps.Marker({
                                map : map,
                                position:location,
                                icon:'assets/icon/end.png'
                            })
                            this.endMarker.push(endMarker);
                            this.endlat=map.getCenter().lat();
                            this.endlng=map.getCenter().lng();
                           }
                          
                           var data={address:address,location:request,flag:this.flag}
                          this.new_address.next(data);
            
        }
    }
            })
        })
    //       google.maps.event.addListener(map,'mouseup',(event)=>{
        
    // })
    
        this.mapIsCreated.next("true")
        return map;
    }
    checkIfCenterMarkerExist(){
        console.log(this.centerMarker_array);
        if(this.centerMarker_array!=undefined){
            for(var i=0; i<this.centerMarker_array.length; i++){
                this.centerMarker_array[i].setMap(null);
            }
        }
       
    }
    
      getCurrentLocation2(){
    let loading=this.loading.create({
      content:'위치정보를 받아오는 중...'
    })
    loading.present().then(()=>{
    })
    let options={timeout:3500,maximumAge :3500,enableHighAccuracy:true}
    let locationObs=Observable.create(observable =>{
      this.geo.getCurrentPosition(options).then(resp=>{
      let lat=resp.coords.latitude;
      let lng=resp.coords.longitude;
      this.starting.next(lat);
      this.ending.next(lng);
      this.latOnly=lat;
      this.lngOnly=lng;
      var image = {
                url: 'https://firebasestorage.googleapis.com/v0/b/ionic-173108.appspot.com/o/7e194ccf-e864-4206-aecf%2Fitsme.png?alt=media&token=7f0e73d2-0d86-43e3-9ec1-7507d9666fdc',
                size: new google.maps.Size(24, 30),
              };
    
      let location=new google.maps.LatLng(lat,lng);
      this.getAjacentStation(lat,lng);
      this.currentLocation=location;
      localStorage.setItem("currentPosition","true");
      localStorage.setItem("lat",lat.toString())
      localStorage.setItem("lng",lng.toString());
      this.map.panTo(location);
      this.checkIfCenterMarkerExist();
      var centerMarker=new google.maps.Marker({
        map: this.map,
        icon:image,
        position: location,
        title: 'Some location'

      })
      this.centerMarker_array.push(centerMarker);

      
      loading.dismiss();
      
    }).catch((error =>{
        localStorage.setItem("currentPosition","false");
        //position error 발생시 다시 위치 추척
      console.log("error ! : "+error)
      console.log(error.code+","+error.message);
      loading.dismiss();
    }))
    
    })
    return locationObs
  }


}