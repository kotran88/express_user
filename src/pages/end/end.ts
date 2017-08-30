import { MapDirective } from './../../components/map';
import { HomePage } from './../home/home';
import { Component, Output, ViewChild } from '@angular/core';
import { NgZone  } from '@angular/core';
import { ViewController, NavController,LoadingController } from 'ionic-angular';


import { MetroServiceProvider } from './../../providers/metro-service/metro-service';

declare var google;
/**
 * Generated class for the EndPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-end',
  templateUrl: 'end.html',
})
export class EndPage {
  @ViewChild('searchBar') myInput ;
  autocompleteItems;
  autocomplete;
  loc:any;
  service = new google.maps.places.AutocompleteService();
  location=new google.maps.Geocoder();
  position:any;

  result_metro:any;
  metro_noDupulicate=[];
  metro_desc=[];
  metro_icon=[];

  constructor (public loading:LoadingController,public metro: MetroServiceProvider,public navCtrl: NavController,  public viewCtrl: ViewController, private zone: NgZone) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
    var result_metro=this.metro.getMetro().subscribe(data=>{
      this.result_metro=data;
      console.log(this.result_metro)
    });
  }
  
  dismiss() {
  }
  goBack(){
    this.viewCtrl.dismiss();
  }
  chooseItem(item: any) {
    var lat;
    var lng;
    console.log("itemmm");
    console.log(item);
    this.location.geocode({'address': item.short}, (results, status)=> {
          if (status === 'OK') {
              this.loc=results[0].geometry.location
              console.log("ok");
              console.log(item.short);
              console.log(this.loc);
              this.viewCtrl.dismiss({loc:item.short,lat:this.loc.lat(),lng:this.loc.lng(),long:item.long});
            
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
  }

  updateSearch() {
    let loading=this.loading.create({
      content:'Loading...'
    })
    loading.present().then(()=>{
    })

    
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      loading.dismiss();
      return;
    }
    let me = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query,  componentRestrictions: {country: 'Kr'} },  (predictions, status)=> {
      console.log("getPlacePredictions");
      console.log(predictions);
      console.log(status);
      me.autocompleteItems = []; 
      me.zone.run(()=> {
        if(predictions!=null){
          predictions.forEach((prediction)=> {
            var icon;
            console.log(prediction.description);
            var temp=prediction.description.split(" ");
            var shortResult=temp[(temp.length-1)]
            console.log(shortResult);
            //indexof 해서 역이름과 일치하는것일때는 json  파일에서 호선정보를 불러와서 아이콘을 붙이자. 
          for(var i=0; i<this.result_metro.length; i++){

            console.log(this.result_metro[i].STATION_NM+"!!!!!!"+shortResult)
            if(shortResult.indexOf(this.result_metro[i].STATION_NM)==0){
                icon=this.result_metro[i].LINE_NUM;
                this.metro_noDupulicate.push(shortResult);
                this.metro_noDupulicate=Array.from(new Set(this.metro_noDupulicate))
                this.metro_icon.push(icon);
                this.metro_icon=Array.from(new Set(this.metro_icon))
                this.metro_desc.push(prediction.description);
                this.metro_desc=Array.from(new Set(this.metro_desc))
                
                
                
            }
          }
          });
          console.log("prediction end ");
          console.log(this.metro_noDupulicate);
          console.log(this.metro_icon);
          console.log(this.metro_desc)
          loading.dismiss();
          for(var i=0; i<this.metro_noDupulicate.length; i++){
            console.log("inserting...")
            
            for(var j=0; j<this.metro_icon.length; j++){
            }
            me.autocompleteItems.push({short: this.metro_icon+","+this.metro_noDupulicate[i], long:this.metro_desc[i]});
            
          }
          
          this.metro_icon=[];
          this.metro_noDupulicate=[];
          this.metro_desc=[];
        }else{
          loading.dismiss();
          console.log("prediction == null"+predictions);
        }
        
      });
    });
  }
}
