import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Http,Headers ,RequestOptions} from '@angular/http';
import { HomePage } from '../pages/home/home';
import { ProfilePage} from '../pages/profile/profile'
import { IonRatingComponent } from '../components/ion-rating/ion-rating';

import { GooglePlus } from '@ionic-native/google-plus';
import { NotifiedPage } from './../pages/notified/notified'
import { ViewRequestListPage } from './../pages/view-request-list/view-request-list';
import { ViewRequestedAllPage } from './../pages/view-requested-all/view-requested-all';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;
  imageUrl:any;

  id:any;

  pages: Array<{title:string,component:any,attr:string}>;
  activePage:any;
  @ViewChild(Nav) nav:Nav
  @ViewChild(GooglePlus) gp2:GooglePlus
  constructor(public modal:ModalController,public http:Http,platform: Platform,statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      
      statusBar.styleDefault();
      splashScreen.hide();
     
     
      
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

