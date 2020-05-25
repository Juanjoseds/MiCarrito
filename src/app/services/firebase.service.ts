import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Injectable, OnInit} from '@angular/core';
import {auth} from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {AlertService} from './alert.service';
import * as firebase from 'firebase';
import {LocalstorageService} from './localstorage.service';

@Injectable({
    providedIn: 'root'
})

export class FirebaseService implements OnInit{

    public login; public email; public userItems; public userCart = []; public cartPrice; private checkall;
    private userDoc$ : Observable<any>;


    constructor(private fauth: AngularFireAuth,
                private afs: AngularFirestore,
                private router: Router,
                private as: AlertService,
                private ls: LocalstorageService) {
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
                    this.userDoc$.subscribe((doc) => {
                        this.userItems = doc;
                        console.log('UserItems:Observable',this.userItems);
                        this.getArrays(); // Obtiene el array para el carrito
                        this.ls.initializeLocalStorage(); // Inicializa las variables de ls
                    });
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
     * Se extrae en forma de array los items del usuario sumando el precio total
     */
    getArrays(){
         this.userCart = [];
         this.cartPrice = 0.0;
         // Controlamos si aún no existe el array cart de firebase
         if(this.userItems !== undefined){
             this.userItems.forEach(element => {
                 if(element[element.id].cart === true){
                     this.userCart.push(element[element.id]);
                     this.cartPrice += parseFloat((element[element.id].price));
                 }
             })
         }
         console.log('UserCart:Array',this.userCart);
    }

    /**
     * Al hacer click en el checkbox se cambia la variable @cart de firebase
     * @param item - Array con toda la información de un producto.
     */
    public async onChecked(item) {
        const namebought = item.name + '.bought';
        await this.afs.doc('User/' + auth().currentUser.email + '/items/' + item.name).update({
            [namebought]: !item.bought
        })
        console.log(item.name + ' Bought', !item.bought);
    }

    /**
     * Cambia la variable cart de firebase del item
     * @param name - Nombre del item a cambiar
     */
    public async changeCart(name:string){
        this.userItems.forEach((element) => {
            if(element[element.id].name === name){
                const namecart = element.id + '.cart';
                this.afs.doc('User/' + auth().currentUser.email + '/items/' + element.id).update({
                    [namecart]: !element[element.id].cart
                });
            }
        })
    }

    /**
     * Crea un nuevo producto en firebase tras comprobar si existe
     * @param productName - String que representa el nombre del nuevo producto
     */
    public async createItem(productName: string) {
        await this.afs.collection('User').doc(auth().currentUser.email).collection('items').doc(productName).ref.get().then((doc) => {
            if(doc.exists){
                // Si existe en firebase comprobamos si ya está añadido
                if(this.userCart.length === 0){
                    this.changeCart(productName);
                }else{
                    // every deja de recorrer cuando se devuelve false
                    this.userCart.every((element, index) => {
                        if(element.name === productName){
                            return false;
                        }else if (element.name !== productName && index === this.userCart.length-1){
                            this.changeCart(productName);
                        }
                    });
                }
            }else{
                // Si no existe en firebase lo añadimos
                const newProduct = {name: productName, price: '0', cart: true, supermarket: 'Ninguno', bought: false};

                this.afs.collection('User').doc(auth().currentUser.email).collection('items').doc(productName).set({
                    [productName]: newProduct
                });
            }
        })
    }

    /**
     * Borra el array correspondiente en firebase mostrando un mensaje de confirmación
     * @param productName - Nombre del producto a eliminar
     */
    public async destroyItem(productName: string) {
        const confirm = await this.as.alertOkCancel('¿Desea borrar ' + productName + '?');
        // Si el usuario hace click en borrar
        if(confirm) {
            await this.afs.collection('User/'+auth().currentUser.email+'/items').doc(productName).delete();
        }
    }

    /**
     * Crea un usuario en firebase
     * @param email - Correo electrónico
     * @param password - Contraseña
     */
    public createUser(email:string, password:string){
        // console.log('Creando con:' + email + ' ' + password);
        this.afs.collection('User').doc(email).ref.get().then(async (doc) => {
            if(doc.exists){
                console.log('¡El usuario ya existe!');
            }else{
                this.afs.collection('User').doc(email).set({}).then(() => {
                    const newProduct = {name: '¡Tu primer producto!', price: '0', cart: true, supermarket: 'Ninguno', bought: false};
                    this.afs.collection('User').doc(email).collection('items').doc(newProduct.name).set({
                        [newProduct.name]: newProduct
                    })

                    firebase.auth().createUserWithEmailAndPassword(email,password).catch((error) => {
                        console.log('Error', error);
                    })
                });
                await this.router.navigateByUrl('/Inicio');
            }
        })
    }

    /**
     * Actualiza el item con los nuevos datos en firebase
     * @param oldname - Nombre del producto en caso de que se haya cambiado, en caso contrario, el actual
     * @param product - Mapa del producto con los datos a actualizar
     */
    public async updateProduct(oldname, product) {
        if(oldname !== product.name){
            await this.afs.collection('User/'+auth().currentUser.email+'/items').doc(oldname).delete().then(() => {
                this.afs.collection('User').doc(auth().currentUser.email).collection('items').doc(product.name).set({
                    [product.name]: product
                });
            });
        }else{
            console.log(oldname + ' ' + product.name);
            await this.afs.doc('User/' + auth().currentUser.email + '/items/' + product.name).update({
                [product.name]: product
            });
        }
    }

    /**
     * Borra todos los productos del carrito
     */
    public async deleteAll() {
        for (const element of this.userCart) {
            console.log(element);
            await this.changeCart(element.name);
        }
    }

    /**
     * Marca todos los checkbox o los desmarca
     */
    public async checkAll(){
        if(this.checkall === undefined){this.checkall = true;}
        for (const element of this.userCart) {
            console.log(element.name, element.cart);
            if(element.bought !== this.checkall){
                await this.onChecked(element);
            }
        }
        this.checkall = !this.checkall;
    }
}
