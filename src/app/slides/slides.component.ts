import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {LocalstorageService} from '../services/localstorage.service';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.scss'],
})
export class SlidesComponent implements OnInit {
  slides = [
    {
      img: '/assets/images/shop.svg',
      titulo: 'Tu compra mas organizada',
      descripcion: 'Añade productos que deseas comprar en tu próxima visita al super.'
    },
    {
      img: '/assets/images/supermercado.svg',
      titulo: 'Tu carrito en la mano',
      descripcion: 'Podrás recordar su precio y supermercado favorito para la próxima visita'
    }
  ];

  constructor(private router: Router, private ls: LocalstorageService) { }

  ngOnInit() {}

  public async goToHome(){
    this.ls.updateVariable('tutorial', true);
    await this.router.navigateByUrl('/');

  }
}
