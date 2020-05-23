import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router, public fbs: FirebaseService) { }
  public product = {
    name: '',
    price: '',
    supermarket: '',
    bought: '',
    cart: ''
  }

  /**
   * Se comprueba si se le pasa por parámetro el id del producto, si no volvemos a inicio
   */
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async () => {
      if(this.router.getCurrentNavigation()){
        if(this.router.getCurrentNavigation().extras.state) {
          this.getProduct(this.router.getCurrentNavigation().extras.state.name)
        }else{
          await this.router.navigateByUrl('/Inicio');
        }
      }else{
        await this.router.navigateByUrl('/Inicio');
      }
    })
  }

  /**
   * Recupera los datos del item pasado por parámetro
   * @param productName - Nombre del producto
   */
  private getProduct(productName:string){
    this.fbs.userItems.forEach((element) => {
      if(element.id === productName){
        this.product.name = element[element.id].name;
        this.product.price = element[element.id].price;
        this.product.supermarket = element[element.id].supermarket;
        this.product.bought = element[element.id].bought;
        this.product.cart = element[element.id].cart;
      }
    })
  }

  public async saveProduct() {
    const oldName = this.product.name;
    const name = (document.getElementById('name') as HTMLInputElement).value.trim();
    const price = (document.getElementById('price') as HTMLInputElement).value.trim();
    const supermarket = (document.getElementById('supermarket') as HTMLInputElement).value.trim();

    // Lógica de reemplazamiento de datos del producto
    if (name !== '' && name !== this.product.name) {
      this.product.name = name;
    }

    if (price.toString() !== '' && price.toString() !== this.product.price) {
      this.product.price = price;
    }

    if (supermarket !== '' && supermarket !== this.product.supermarket) {
      this.product.supermarket = supermarket;
    }

    await this.fbs.updateProduct(oldName, this.product).then(() =>
        this.router.navigateByUrl('/Inicio'));
  }
}
