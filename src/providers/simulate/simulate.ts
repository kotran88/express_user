import { AngularFireDatabase,    FirebaseListObservable
 } from 'angularfire2/database';
import { FirebaseService } from './../../providers/firebase-service';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
declare var google;
/*
  Generated class for the SimulateProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SimulateProvider {
  public directionsService:any;
  public myRoute:any;
  public myRouteIndex:number;
  cars_array:any;
  activeUserLocation:any;
   items: FirebaseListObservable<any>;
  coord:any;
  constructor(public afd:AngularFireDatabase) {
    this.cars_array=[];
    this.activeUserLocation=[];
    this.directionsService=new google.maps.DirectionsService();
    this.items = this.afd.list('/employees_status/Available/', { preserveSnapshot: true });
    console.log('Hello SimulateProvider Provider');
    this.items.subscribe(snapshots=>{
        snapshots.forEach(element => {

          //특정유저로 한정시킨다. (여기서는 배송자 한사람에 대해서만 보여주면 되기에 한명으로 한정함. )
          if(element.val().userid=="kotraner"){
            this.activeUserLocation.push(element.val());
            console.log("pushed");
            console.log(element.val());
          }
          
          
        });
    })
      for (var i=0; i<this.activeUserLocation.length; i++){
      }

  }
 
  getCars(lat,lng){
    console.log("getCars");
    let carData=this.cars[this.carIndex];
    this.carIndex++;
    if(this.carIndex>this.cars.length-1){
      this.carIndex=0;
    }
    console.log(carData);
    console.log(carData.cars[0]);
    console.log(carData.cars[0].coord.lat+",,,,"+carData.cars[0].coord.lng);
    console.log(this.activeUserLocation.length);
    console.log("sssasdasda");
    console.log(this.activeUserLocation)
    console.log(this.cars_array.length);
    if(this.activeUserLocation.length>0){
      this.cars_array=[];
      console.log(this.activeUserLocation.length);
      console.log(this.activeUserLocation[0].lat+"!!!!!"+this.activeUserLocation[0].lng);
       for (var i=0; i<this.activeUserLocation.length; i++){
         console.log("isactive");
         console.log(this.activeUserLocation[i].isactive);
            this.cars_array.push({
              id:(i+1),
              coord:{
                lat:this.activeUserLocation[i].lat,
                lng:this.activeUserLocation[i].lng
              },
              isactive:this.activeUserLocation[i].isactive,
              userid:this.activeUserLocation[i].userid,
              created_date:this.activeUserLocation[i].create_date
            })
            // carData.cars[i].coord.lat=this.activeUserLocation[i].lat;
            // carData.cars[i].coord.lng=this.activeUserLocation[i].lng;
            console.log("i : "+i+"????"+this.cars_array[i]);
            console.log(this.cars_array);
    }
    }
    this.activeUserLocation=[];
    console.log("this.cars");
    console.log(this.cars);
    console.log("return on the verge of ");
    console.log(carData);
    console.log(this.cars_array);
    return Observable.create(
      observer=>observer.next(this.cars_array)
    )
  }
  calculateRoute(start,end){
    console.log(start+","+end);
    console.log("calculateRoute")
    return Observable.create(observable =>{

      this.directionsService.route({
        origin:start,
        destination:end,
        travelMode:google.maps.TravelMode.DRIVING
      },(response,status)=>{
        if(status===google.maps.DirectionsStatus.OK){
          observable.next(response);
        }else{
          console.log(status);
          return;
        }
      })
    })
  }
  
  getPickupCar(){
    return Observable.create(observable=>{
      let car=this.myRoute[this.myRouteIndex];
      observable.next(car);
      this.myRouteIndex++;
    })
  }
  private carIndex:number=0;
  

  private cars1={
    cars:[
      {
        id:1,
        coord:{
         lat:37.479062,
          lng:127.049611
        }
      },
      {
        id:2,
        coord:{
          lat:37.479147,
          lng:127.046649
        }
      }
    ]
  };

  public cars:Array<any>=[this.cars1]
}
