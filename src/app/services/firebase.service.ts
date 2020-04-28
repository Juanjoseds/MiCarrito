import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Injectable} from '@angular/core';
import {auth} from 'firebase';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})

export class firebaseService {
    private login; private email;
    private cart;

    constructor(private fdb: AngularFireDatabase, private fauth: AngularFireAuth) {
        this.login = this.fauth.authState.subscribe(
            (data) => {console.log('logged in:', data); this.getSession();},
            (error) => console.log('YEKA', error),
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
    }

    /*
        Obtiene los items del usuario de Firebase
     */
    async getFireItems(email){
        const snapshot = await firebase.firestore().collection('User').doc(email).get().then(function(doc){
            if(doc.exists){
                console.log(doc.data());
            }else{
                console.log('[ERROR] ¡No existe el documento!');
            }
        });
    }

    async getSession(){
        let email = undefined;
        await firebase.auth().onAuthStateChanged(function (user) {
            if(user){
                email = user.email;
            }else{
                console.log('No hay una sesión activa');
                email = undefined;
            }
        })
        if(email !== undefined){
            this.email = email;
            await this.getFireItems(this.email);
        }
    }
}
