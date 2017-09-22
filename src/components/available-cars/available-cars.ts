import { AngularFireDatabase } from 'angularfire2/database';
import { CarProvider } from './../../providers/car/car';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs';

declare var google;

@Component({
   selector: 'available-cars',
  templateUrl: 'available-cars.html',
  providers:[CarProvider]
})
export class AvailbleCarDirective implements OnInit,OnChanges  {
    @Input() isPickupRequested:boolean;
    @Input() map:any;
    @Input() fetchingExpress:boolean;
    @Input() deliveryGuy:string;

    public carMarkers:Array<any>;
    popup:any;
    ngOnInit() {
        
    }
    ngOnChanges() {
        if(this.fetchingExpress){
            this.fetchAndRefreshCars(this.deliveryGuy);
        }
    }
    constructor(public carService:CarProvider, private dialog:Dialogs,public afDatabase:AngularFireDatabase){
        this.carMarkers=[];
    }
    deleteCarMarker(){
        this.carMarkers=[];
    }
    updateCarMarker(car){
        var numofCars=this.carMarkers.length;
        // for(var i=0; i<this.carMarkers.length; i++){
            
        //     if(car.isactive=="false"||car.isactive==undefined){
        //         console.log("isactive 가 false 임"+car.id+","+this.carMarkers[i].id);
        //         if(car.id==this.carMarkers[i].id){
        //             this.carMarkers[i].set('isactive',car.isactive);
        //             console.log(this.carMarkers[i]);
        //         }
        //     }else{
        //          if(car.id==this.carMarkers[i].id){
        //             this.carMarkers[i].set('isactive',car.isactive);
                   
        //             console.log("true 다다다다다"+car.id+","+this.carMarkers[i].id);
        //         this.carMarkers[i].setVisible(true);
        //         }
                
        //     }
        //     // this.carMarkers[i].set('isactive',car.isactive);
            
            
            
        // }
        for(var i=0,numOfCars=this.carMarkers.length;  i < numofCars; i++){
            
            if(this.carMarkers[i].id===car.id){
                if(this.carMarkers[i].isactive=="false"){
                this.carMarkers[i].setVisible(false);
                 return
                }else{
                    this.carMarkers[i].setPosition(new google.maps.LatLng(car.coord.lat,car.coord.lng));
                    this.carMarkers[i].setVisible(true);
                 return
                }
            }
        }
        
        this.addCarMarker(car);
    }
  
    addCarMarker(car){
        let carMarker=new google.maps.Marker({
            map:this.map,
            position : new google.maps.LatLng(car.coord.lat,car.coord.lng),
            icon : 'assets/icon/start2.png'
        })
      
        carMarker.set('lat',car.coord.lat);
        carMarker.set('id',car.id);
        carMarker.set('lng',car.coord.lng);
        carMarker.set('userid',car.userid);
        carMarker.set('created_date',car.created_date);
        carMarker.set('isactive',car.isactive);
        let popup=new google.maps.InfoWindow({
            content:'<p>id:'+car.userid+'</p>'+'<p>lng:'+car.coord.lng+'</p>'
        });
        carMarker.addListener('click',()=>{
              popup.open(this.map,carMarker);
        })
        this.carMarkers.push(carMarker);
    }
    fetchAndRefreshCars(guy){
        this.carService.getCars(9,9,guy)
        .subscribe(cars_array=>{
            if(!this.isPickupRequested){
               (<any>cars_array).forEach(car=>{
                   this.updateCarMarker(car);
               })
            }
        })

    }
}