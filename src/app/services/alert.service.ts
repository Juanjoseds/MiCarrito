import {Injectable} from '@angular/core';
import {AlertController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

export class AlertService {

    constructor(public alertController: AlertController) {}

    /**
     * Genera una alerta OK - CANCEL
     * @param msg - String a mostrar en el mensaje
     */
    async alertOkCancel(msg: string): Promise<boolean> {
        let resolve: (confirm: boolean) => void;
        const promise = new Promise<boolean>(res => {
                resolve = res;
        });
        const alert = await this.alertController.create({
            header: 'Borrar',
            message: msg,
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        resolve(false);
                    }
                }, {
                    text: 'Borrar',
                    handler: () => {
                        resolve(true);
                    }
                }
            ]
        });

        await alert.present();
        return promise;
    }
}
