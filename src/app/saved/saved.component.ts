import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss'],
})
export class SavedComponent implements OnInit {

  constructor(public fbs: FirebaseService, private router: Router) {}

  ngOnInit() {}

  public async goToEdit(productName) {
    const navigationExtras: NavigationExtras = {state: {name: productName}};
    await this.router.navigate(['/edit'], navigationExtras);
  }
}
