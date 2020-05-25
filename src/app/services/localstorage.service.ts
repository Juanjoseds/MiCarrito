import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})

export class LocalstorageService {
    constructor() {}

    /**
     * Inicializa las variables de LocalStorage si no lo están
     */
    public initializeLocalStorage(){
        // Variable order
        if(localStorage.getItem('order') === null ){
            localStorage.setItem('order', 'alfabéticamente')
        }
    }

    public order(){
        if(localStorage.getItem('order') === 'alfabéticamente'){
            localStorage.setItem('order', 'supermercado');
        }else if (localStorage.getItem('order') === 'supermercado'){
            localStorage.setItem('order', 'comprado');
        }else if (localStorage.getItem('order') === 'comprado'){
            localStorage.setItem('order', 'alfabéticamente');
        }
    }

    public getNextOrder(){
        if(localStorage.getItem('order') === 'alfabéticamente'){
            return 'por supermercado';
        }else if (localStorage.getItem('order') === 'supermercado'){
            return 'por marcado';
        }else if (localStorage.getItem('order') === 'comprado'){
            return 'alfabéticamente';
        }
    }
}
