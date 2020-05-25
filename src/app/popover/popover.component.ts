import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {LocalstorageService} from '../services/localstorage.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(public fbs: FirebaseService, public ls: LocalstorageService) {}
  ngOnInit() {}

}
