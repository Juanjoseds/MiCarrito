import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {firebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  constructor(private activatedRoute: ActivatedRoute, private fbs: firebaseService) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.folder === 'auth'){
      this.folder = 'Acceder';
    }
  }

}
