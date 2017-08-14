import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotifiedPage } from './notified';

@NgModule({
  declarations: [
    NotifiedPage,
  ],
  imports: [
    IonicPageModule.forChild(NotifiedPage),
  ],
  exports: [
    NotifiedPage
  ]
})
export class NotifiedPageModule {}
