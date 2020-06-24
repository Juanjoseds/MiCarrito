import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {FirebaseService} from './services/firebase.service';
import {SettingsComponent} from './settings/settings.component';
import {LocalstorageService} from './services/localstorage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public authPage = [
    {
      title: 'Entrar',
      url: 'auth'
    }
  ];

  public appPages = [
      {
      title: 'Inicio',
      url: 'Inicio',
      icon: 'home'
    },
    {
      title: 'Guardados',
      url: 'saved',
      icon: 'bookmark'
    },
    {
      title: 'Ajustes',
      url: 'settings',
      icon: 'cog'
    }
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public fbs: FirebaseService,
    public settings: SettingsComponent,
    public ls: LocalstorageService,
    public router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Texto oscuro para fondo blanco
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByName('white');
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    this.settings.changeNightMode();
  }
}
