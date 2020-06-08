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

    public login; public email; public userItems; public userCart = []; public cartPrice;
    private checkall; public comprado = []; public supermarket = [];

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
                    this.ls.initializeLocalStorage(); // Inicializa las variables de ls
                    this.userDoc$ = this.getUserItems();
                    // Observable de los items del usuario
                    this.userDoc$.subscribe((doc) => {
                        this.userItems = doc;
                        console.log('UserItems:Observable',this.userItems);
                        this.getArrays(); // Obtiene el array alfabeticamente
                        this.getCompradoArray(); // Obtiene el array ordenado por bought
                        this.getSupermarketArray() // Obtiene el array ordenado por supermercado
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
     * Al hacer click en el checkbox se cambia la variable @bought de firebase
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
     * Cambia la variable @cart de firebase del item
     * @param name - Nombre del item a cambiar
     */
    public async changeCart(name:string){
        this.userItems.forEach((element) => {
            if(element[element.id].name === name){
                // Pone el campo bought a false en firebase
                if(element[element.id].bought === true){
                    this.onChecked(element[element.id]);
                }
                // Lo actualiza en firebase
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
        (document.getElementById('search') as HTMLInputElement).value = '';
        const exists = this.userItems.some(element => {
            // Si el producto existe en la BD solo cambia @cart
            if(element.id === productName){
                if(element[element.id].cart === false){
                    this.changeCart(productName);
                }
                return true;
            }
        });

        if(exists !== true){
            const newProduct = {name: productName, price: '0', cart: true, supermarket: 'Ninguno', bought: false};

            await this.afs.collection('User').doc(auth().currentUser.email).collection('items').doc(productName).set({
                [productName]: newProduct
            });
        }
    }

    /**
     * Borra el array correspondiente en firebase mostrando un mensaje de confirmación
     * @param productName - Nombre del producto a eliminar
     */
    public async destroyItem(productName: string) {
        const confirm = await this.as.alertOkCancel('¿Desea borrar ' + productName + '?');
        // Si el usuario hace click en borrar
        if(confirm) {
            await this.afs.collection('User/'+auth().currentUser.email+'/items').doc(productName).delete().then(() => {
                this.router.navigateByUrl('/Inicio');
            });
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
        const confirm = await this.as.alertOkCancel('¿Desea vaciar el carrito?');

        if(confirm) {
            for (const element of this.userCart) {
                console.log(element);
                await this.changeCart(element.name);
            }
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

    public getCompradoArray(){
        this.comprado = [];
        // Almacena primero los false
        this.userCart.forEach(element => {
            if(element.bought === false){
                this.comprado.push(element);
            }
        });

        // Almecena segundo los true
        this.userCart.forEach(element => {
            if(element.bought === true){
                this.comprado.push(element);
            }
        });
    }

    public getSupermarketArray(){
        this.supermarket = [];

        this.userCart.forEach(element => {
            if(!this.supermarket.includes(element.supermarket)){
                this.supermarket.push(element.supermarket);
            }
        });

        if(this.supermarket.includes('Ninguno')){
            const indice = this.supermarket.indexOf('Ninguno');
            this.supermarket.splice(indice, 1);
            this.supermarket.push('Ninguno');
        }
        console.log(this.supermarket);
    }
}
