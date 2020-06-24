import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})

export class LocalstorageService {
    constructor() {
    }

    /**
     * Inicializa las variables de LocalStorage si no lo están
     */
    public initializeLocalStorage(){
        // Variable order
        if(localStorage.getItem('order') === null ){
            localStorage.setItem('order', 'alfabéticamente')
        }
    }

    /**
     * Actualiza la variable order del localstorage con la ordenación actual
     */
    public order(){
        if(localStorage.getItem('order') === 'alfabéticamente'){
            localStorage.setItem('order', 'supermercado');
        }else if (localStorage.getItem('order') === 'supermercado'){
            localStorage.setItem('order', 'comprado');
        }else if (localStorage.getItem('order') === 'comprado'){
            localStorage.setItem('order', 'alfabéticamente');
        }
    }

    /**
     * Devuelve el valor de order
     */
    public getOrder(){
        return localStorage.getItem('order');
    }

    /**
     * Devuelve el valor de NightMode
     */
    public getNightMode(){
        const nm = localStorage.getItem('nightMode');
        if(nm === null){
            return false;
        }else{
            return nm;
        }
    }

    /**
     * Método para estética en el popover
     */
    public getNextOrder() {
        if (localStorage.getItem('order') === 'alfabéticamente') {
            return 'por supermercado';
        } else if (localStorage.getItem('order') === 'supermercado') {
            return 'por marcado';
        } else if (localStorage.getItem('order') === 'comprado') {
            return 'alfabéticamente';
        }
    }

    public updateVariable(name:string, content:any){
        localStorage.setItem(name, content);
    }

    public getVariable(name:string){
        return localStorage.getItem(name);
    }
}
