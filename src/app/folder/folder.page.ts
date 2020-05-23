import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FirebaseService} from '../services/firebase.service';
import {PopoverController} from '@ionic/angular';
import {HomeComponent} from '../home/home.component';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  constructor(private activatedRoute: ActivatedRoute, public fbs: FirebaseService, public popoverController: PopoverController) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.folder === 'auth'){
      this.folder = 'Acceder';
    }
    if(this.folder === 'register'){
      this.folder = 'Regístrate';
    }
    if(this.folder === 'edit'){
      this.folder = 'Editar';
    }
  }

  async popover(ev: any) {
    const popover = await this.popoverController.create({
      component: HomeComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

}
