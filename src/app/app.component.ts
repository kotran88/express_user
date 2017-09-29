import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,ModalController,Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Http,Headers ,RequestOptions} from '@angular/http';
import { HomePage } from '../pages/home/home';
import { ProfilePage} from '../pages/profile/profile'
import { IonRatingComponent } from '../components/ion-rating/ion-rating';

import { GooglePlus } from '@ionic-native/google-plus';
import { NotifiedPage } from './../pages/notified/notified'
import { StandbyPage} from './../pages/standby/standby'
import { ViewRequestListPage } from './../pages/view-request-list/view-request-list';
import { ViewRequestedAllPage } from './../pages/view-requested-all/view-requested-all';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  imageUrl:any;

  id:any;

  pages: Array<{title:string,component:any,attr:string}>;
  activePage:any;
  @ViewChild(Nav) nav:Nav
  @ViewChild(GooglePlus) gp2:GooglePlus
  constructor(public events: Events,public modal:ModalController,public http:Http,platform: Platform,statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      
      statusBar.styleDefault();
      splashScreen.hide();
     if(platform.is('android')){
      var one=window["plugins"].OneSignal
      .startInit("2192c71b-49b9-4fe1-bee8-25617d89b4e8", "916589339698")
      one.handleNotificationOpened((jsonData)=> {
               let value=jsonData.notification.payload.additionalData
               if(value.status=="assigned"){
                this.events.publish('status',value.status)
                this.events.publish('itemObject',value.itemObject)
               }else if(value.status=="finished"){
                   alert("finished");
               }else if(value.status=="chat"){
                 this.events.publish('status',value.status);
                 this.events.publish('itemObject',value.obejct);
               }

               })
               .endInit();
     }
     
      
    });
  }
  openPage(page) {
    if(page.attr=="Logout"){
        this.gp2.logout();
        this.nav.setRoot(LoginPage);
    }else{
      this.nav.setRoot(page.component);
      this.activePage=page;
    }
  }
  checkActive(page){
    return page==this.activePage;
  }
}

