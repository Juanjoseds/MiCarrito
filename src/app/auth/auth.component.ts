import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {

  constructor(public fbs: FirebaseService) { }

  ngOnInit() {}


  /**
   * Obtiene y comprueba los datos obtenidos del login
   */
  public checkAuth(){
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password') as HTMLInputElement).value.trim();

    if(email !== '' || password !== ''){
      this.fbs.loginEmailAndPassword(email, password);
    }
  }

}
