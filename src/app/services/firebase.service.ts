import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Injectable, OnInit} from '@angular/core';
import {auth} from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {AlertService} from './alert.service';

@Injectable({
    providedIn: 'root'
})

export class FirebaseService implements OnInit{

    public login; public email; public userItems; public userCart = [];
    private userDoc$ : Observable<any>;


    constructor(private fauth: AngularFireAuth,
                private afs: AngularFirestore,
                private router: Router,
                private as: AlertService) {
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
                    this.userDoc$ = this.getUserItems();
                    this.userDoc$.subscribe((doc) => {this.userItems = doc; console.log(this.userItems); this.getArrays();});

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
        }).catch((error) =>
            console.log('Auth Error', error)
        ));
    }

    /**
     * Desconecta al usuario actual
     */
    public logout(){
        auth().signOut().then(() =>
            console.log('Logout sucessfully')
        ).catch((error) =>
            console.log('Error in logout', error));
        this.email = undefined;
    }

    /**
     * Obtiene un observable con la colección de items del usuario
     */
     getUserItems(): Observable<any> {
         // auth().currentUser.email
        return this.afs.collection('User/'+auth().currentUser.email+'/items').snapshotChanges()
            .pipe(
                map(actions =>
                actions.map(a => {
                    const data = a.payload.doc.data() as any;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            )
     }

    /**
     * Obtenemos los datos de firebase en forma de Array para iterar facilmente
     */
    getArrays(){
         this.userCart = [];
         // Controlamos si aún no existe el array cart de firebase
         if(this.userItems !== undefined){
             this.userItems.forEach(element => {
                 this.userCart.push(element[element.id]);
             })
         }
    }

    /**
     * Al hacer click en el checkbox se cambia la variable @cart de firebase
     * @param item - Array con toda la información de un producto.
     */
    async onChecked(item) {
        const name = item.name + '.bought';
        await this.afs.doc('User/' + auth().currentUser.email + '/items/' + item.name).update({
            [name]: !item.bought
        })
        console.log(item.name + ' Bought', !item.bought);
    }


    /**
     * Crea un nuevo array en firebase con el nuevo producto
     * @param productName - String que representa el nombre del nuevo producto
     */
    public async createItem(productName: string) {
        const newProduct = {name: productName, price: '0', cart: true, supermarket: 'Ninguno', bought: false};

        await this.afs.collection('User/carrito@carrito.com/items').doc(productName).set({
            [productName]: newProduct
        })
    }

    /**
     * Borra el array correspondiente en firebase
     * @param productName - Nombre del producto a eliminar
     */
    public async destroyItem(productName: string) {
        const confirm = await this.as.alertOkCancel('¿Desea borrar ' + productName + '?');
        // Si el usuario hace click en borrar
        if(confirm) {
            await this.afs.collection('User/carrito@carrito.com/items').doc(productName).delete();

        }
    }
}
