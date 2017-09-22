import { CarProvider } from './../providers/car/car';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NavController, LoadingController } from 'ionic-angular';
declare var google;


@Component({
   selector: 'pickup',
  templateUrl: 'pickup.html',
    providers:[CarProvider]
})
export class PickupDirective   {
    flag:boolean=true
    @Input() isPinSet:boolean;
    @Input() map:any;
    @Input() refreshing:any;
    @Input() changeMarker:any;
    @Output() updatedPickupLocation : EventEmitter<any>=new EventEmitter();
    @Output() dragging : EventEmitter<any>=new EventEmitter();
    private pickupMarker: any;
    private popup:any;
    public isactive:any;
    public flag_start:boolean=false;
    public flag_end:boolean=false;
    public flag_default:boolean=true;
    constructor(public loading:LoadingController,public geo:Geolocation){
         console.log("PickupDirective")
    }
   ngOnChanges(){
       if(this.changeMarker=="endMarker"){
           this.flag_end=true;
           this.flag_start=false;
           this.flag_default=false;
       }else if(this.changeMarker=="default"||this.changeMarker==undefined){
        this.flag_end=false;
        this.flag_start=false;
        this.flag_default=true;
       }else{
        this.flag_end=false;
        this.flag_start=true;
        this.flag_default=false;
       }
        console.log(this.changeMarker);
   }
}