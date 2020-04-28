import { Component, OnInit } from '@angular/core';
import {firebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {

  constructor(private fbs: firebaseService) { }

  ngOnInit() {}


  private checkAuth(){
    let email = (document.getElementById('email') as HTMLInputElement).value.trim();
    let password = (document.getElementById('password') as HTMLInputElement).value.trim();

    if(email !== '' || password !== ''){
      this.fbs.loginEmailAndPassword(email, password);
    }
  }

}
