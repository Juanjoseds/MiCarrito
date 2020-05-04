import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Injectable, OnInit} from '@angular/core';
import {auth} from 'firebase';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class firebaseService implements OnInit{

    public login; public email; public userItems; public userCart = [];
    private userDoc$ : Observable<any>;


    constructor(private fauth: AngularFireAuth, private afs: AngularFirestore) {
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
                    this.userDoc$.subscribe((doc) => {this.userItems = doc.cart; console.log(this.userItems); this.getArrays();});

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
        return fromPromise(this.fauth.signInWithEmailAndPassword(email, password));
    }

    /**
     * Desconecta al usuario actual
     */
    public logout(){
        auth().signOut().then(function() {
            console.log('Logout sucessfully');
        }).catch(function(error) {
            console.log('Error in logout');
        });
        this.email = undefined;
    }

    /**
     * Obtiene los el documento del usuario
     */
     getUserDoc(): Observable<any> {
        return this.afs.doc('User/' + auth().currentUser.email).valueChanges();
     }

    /**
     * Obtenemos los datos de firebase en forma de Array para iterar facilmente
     */
    getArrays(){
         this.userCart = [];
         this.userItems.forEach(element => {
             if(element.cart === true){this.userCart.push(element);}
         })
     }
}
