import { Component, Input, Output, EventEmitter} from '@angular/core';

/**
 * Generated class for the IonRatingComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'ion-rating',
  templateUrl: 'ion-rating.html'
})
export class IonRatingComponent {
  @Input() numStars:number=5;
  @Input() value:number=2.5;
  @Output() ionClick:EventEmitter<number> = new EventEmitter<number>();

  stars:string[]=[];

  text: string;

  constructor() {
    console.log('Hello IonRatingComponent Component');
    this.text = 'Hello World';
  }
  starClicked(index){
    console.log(index);
    this.value=index + 1;
    this.ionClick.emit(this.value);
    this.calc();
  }
  calc(){
    this.stars=[];
    let temp=this.value;
    for(let i=0; i<this.numStars; i++, temp--){
      if(temp>=1){
        this.stars.push("star")
      }else if(temp>0&&temp<1){
        this.stars.push("star-half")
      }else{
        this.stars.push("star-outline")
      }
    }
  }
  ngAfterViewInit(){
    this.calc();
  }

}
