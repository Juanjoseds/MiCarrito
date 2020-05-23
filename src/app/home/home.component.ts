import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {NavigationExtras, Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(public fbs: FirebaseService, private router: Router) {
  }

  ngOnInit() {}

  public closeSliding(itemSliding){
    itemSliding.close();
  }

  public goToEdit(productName){
    const navigationExtras: NavigationExtras = { state: {name: productName}};
    this.router.navigate(['/edit'], navigationExtras);
  }
}
