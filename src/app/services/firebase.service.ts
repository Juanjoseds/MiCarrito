import {Observable, Subscription} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Injectable, OnInit} from '@angular/core';
import {auth} from 'firebase';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})

export class firebaseService implements OnInit{

    public login; public email; public userCart;
    private userDoc$ : Observable<any>;


    constructor(private fauth: AngularFireAuth, private afs: AngularFirestore) {
        this.loginUser();
    }

    ngOnInit() {}


    /*
        Genera un observable con el login del usuario
     */
    public loginUser(){
        this.login = this.fauth.authState.subscribe(
            (data) => {
                // No realizamos acciones si no hay usuario conectado (pero seguimos escuchando por si se loguea)
                if(data !== null){
                    console.log('logged in:', data);
                    this.email = data.email;
                    this.userDoc$ = this.getUserDoc();
                    this.userDoc$.subscribe((doc) => {this.userCart = doc.cart; console.log('UserCart', this.userCart)});
                }
            },
            (error) => console.log('error', error),
            () => console.log('auth complete')
        );
    }

    /*
        Login con usuario y contraseña
     */
    public loginEmailAndPassword(email, password):Observable <any>{
        return fromPromise(this.fauth.signInWithEmailAndPassword(email, password));
    }

    /*
        Desconecta al usuario actual
     */
    public logout(){
        auth().signOut().then(function() {
            console.log('Logout sucessfully');
        }).catch(function(error) {
            console.log('Error in logout');
        });
        this.email = undefined;
    }

    /*
        Obtiene los el documento del usuario
     */
     getUserDoc(): Observable<any> {
        return this.afs.doc('User/' + auth().currentUser.email).valueChanges();
     }
}
