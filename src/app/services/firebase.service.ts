import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Injectable, OnInit} from '@angular/core';
import {auth, firestore} from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})

export class firebaseService implements OnInit{

    public login; public email; public userItems; public userCart = [];
    private userDoc$ : Observable<any>;


    constructor(private fauth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
        this.loginUser();
    }

    ngOnInit() {}


    /**
     * Genera un observable con el login del usuario
     */
    public loginUser(){
        this.login = this.fauth.authState.subscribe(
            (data) => {
                // No realizamos acciones si no hay usuario conectado (pero seguimos escuchando por si se loguea)
                if(data !== null){
                    console.log('logged in:', data);
                    this.email = data.email;
                    this.userDoc$ = this.getUserDoc();
                    this.userDoc$.subscribe((doc) => {this.userItems = doc.items; console.log(this.userItems); this.getArrays(); });

                }
            },
            (error) => console.log('error', error),
            () => console.log('auth complete')
        );
    }

    /**
     * Login con usuario y contraseña
     * @param email - Correo electrónico del usuario
     * @param password - Contraseña del usuario
     */
    public loginEmailAndPassword(email, password):Observable <any>{
        return fromPromise(this.fauth.signInWithEmailAndPassword(email, password).then(() => {
            this.router.navigateByUrl('/Inicio');
        }).catch(function (error) {
            console.log('Auth Error', error);
        }));
    }

    /**
     * Desconecta al usuario actual
     */
    public logout(){
        auth().signOut().then(function() {
            console.log('Logout sucessfully');
        }).catch(function(error) {
            console.log('Error in logout', error);
        });
        this.email = undefined;
    }

    /**
     * Obtiene un observable con el documento del usuario
     */
     getUserDoc(): Observable<any> {
        return this.afs.doc('User/' + auth().currentUser.email).valueChanges();
     }

    /**
     * Devuelve la ruta de firebase del usuario
     */
    getUserData(){
         return this.afs.collection('User').doc(auth().currentUser.email);
     }

    /**
     * Obtenemos los datos de firebase en forma de Array para iterar facilmente
     */
    getArrays(){
         this.userCart = [];
         // Controlamos si aún no existe el array cart de firebase
         if(this.userItems !== undefined){
             this.userItems.forEach(element => {
                 if(element.cart === true){this.userCart.push(element);}
             })
         }
    }

    /**
     * Al hacer click en el checkbox se cambia la variable @cart de firebase
     * @param item - Array con toda la información de un producto.
     */
    onChecked(item){
        // return this.afs.doc('User/' + auth().currentUser.email).update('cart')
    }


    /**
     * Crea un nuevo array en firebase con el nuevo producto
     * @param productName - Texto que representa el nombre del nuevo producto
     */
    public createItem(productName){
        const newProduct = {name: productName, price: 0, cart: true, supermarket: 'Ninguno', bought: false};

        // Une el array existente en firebase con newProduct
        this.getUserData().update({
            items: firestore.FieldValue.arrayUnion(newProduct)
        })
    }

    /**
     * Borra el array correspondiente en firebase
     * @param item - Array a eliminar
     */
    public destroyItem(item){
        const destroyProduct = {name: item.name, price: item.price, cart: item.cart, supermarket: item.supermarket, bought: item.bought};
        this.getUserData().update({
            items: firestore.FieldValue.arrayRemove(destroyProduct)
        })
    }
}
