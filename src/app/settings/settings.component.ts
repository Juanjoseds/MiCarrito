import {Component, Injectable, OnInit} from '@angular/core';
import {LocalstorageService} from '../services/localstorage.service';
import {StatusBar} from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})

@Injectable({
  providedIn: 'root'
})
export class SettingsComponent implements OnInit {

  constructor(public ls: LocalstorageService, private statusBar: StatusBar) {
  }

  ngOnInit() {

  }

  public nightmode(bool:boolean){
    this.ls.updateVariable('nightMode', bool);
    this.changeNightMode();
  }

  /**
   * Cambia el modo noche según el valor de LocalStorage.
   * NOTA: classList.toggle cambia el valor que está (si lo encuentra, lo quita), hay que tener cuidado con esto.
   */
  public changeNightMode(){
    const nm = this.ls.getNightMode();
    console.log(document.body.classList);

    if(document.body.classList.contains('dark') && nm === false){ // Sí esta en modo oscuro y hay que quitarlo
      document.body.classList.remove('dark');
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByName('white');
    }else if(document.body.classList.contains('dark') === false && nm === true){ // Sí NO está en modo oscuro y hay que ponerlo
      document.body.classList.add('dark');
      this.statusBar.styleLightContent();
      this.statusBar.backgroundColorByHexString('#121212');
    }
    console.log(document.body.classList);
  }
}
