import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {NavigationExtras, Router} from '@angular/router';
import {LocalstorageService} from '../services/localstorage.service';
import {SettingsComponent} from '../settings/settings.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(public fbs: FirebaseService, private router: Router, public ls: LocalstorageService, public settings: SettingsComponent) {
  }

  ngOnInit() {
  }

  public closeSliding(itemSliding){
    itemSliding.close();

  }

  public async goToEdit(productName) {
    const navigationExtras: NavigationExtras = {state: {name: productName}};
    await this.router.navigate(['/edit'], navigationExtras);
  }


}
