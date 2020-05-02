import { Component, OnInit } from '@angular/core';
import {firebaseService} from '../services/firebase.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {

  constructor(public fbs: firebaseService, private router: Router) { }

  ngOnInit() {}


  public checkAuth(){
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password') as HTMLInputElement).value.trim();

    if(email !== '' || password !== ''){
      this.fbs.loginEmailAndPassword(email, password);
      this.router.navigateByUrl('/Inicio');
    }
  }

}
