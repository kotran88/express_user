import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { IonRatingComponent } from '../components/ion-rating/ion-rating';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  pages: Array<{title:string,component:any}>;
  activePage:any;
  @ViewChild(Nav) nav:Nav
  constructor(platform: Platform,statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page){
    this.nav.setRoot(page.component);
    this.activePage=page;
  }
  checkActive(page){
    return page==this.activePage;
  }
}

