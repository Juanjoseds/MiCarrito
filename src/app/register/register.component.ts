import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  public regEnabled = false;

  constructor(private fbs: FirebaseService) { }
  ngOnInit() {}

  /**
   * Registra al usuario en la base de datos con sus credenciales tras comprobar si existe
   */
  public register(){
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const password1 = (document.getElementById('password1') as HTMLInputElement).value.trim();
    const password2 = (document.getElementById('password2') as HTMLInputElement).value.trim();

    // Realizamos las mismas comprobaciones de seguridad para evitar grietas de seguridad si alteran el HTML
      if (password1 === password2 && email.length !== 0) {
        this.fbs.createUser(email,password1);
      }
  }

  /**
   * Comprobaciones de seguridad antes de habilitar el botón de registro
   */
  public enableButton(){
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const password1 = (document.getElementById('password1') as HTMLInputElement).value.trim();
    const password2 = (document.getElementById('password2') as HTMLInputElement).value.trim();

    if(password1.length !== 0 && password2.length !== 0) {
        if (password1 === password2) {
          document.getElementsByClassName('passwordsucess')[0].classList.remove('ocultar');
          this.regEnabled = email.length !== 0;
        }else {
          document.getElementsByClassName('passwordsucess')[0].classList.add('ocultar');
          this.regEnabled = false;
        }
    }
  }
}
