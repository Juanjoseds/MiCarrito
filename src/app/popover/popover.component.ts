import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {LocalstorageService} from '../services/localstorage.service';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(public fbs: FirebaseService, public ls: LocalstorageService, private popoverController: PopoverController) {}
  ngOnInit() {}

  public async close() {
    await this.popoverController.dismiss();
  }
}
