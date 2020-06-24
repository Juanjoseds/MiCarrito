import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment.prod';
import {SlidesComponent} from './slides/slides.component';


@NgModule({
    declarations: [AppComponent, SlidesComponent],
  entryComponents: [],
  imports: [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      AngularFireAuthModule,
      AngularFireModule.initializeApp(environment.config)
  ],
  providers: [
      StatusBar,
      SplashScreen,
      {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
