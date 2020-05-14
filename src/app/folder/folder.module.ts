import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import {HomeComponent} from '../home/home.component';
import {AuthComponent} from '../auth/auth.component';
import {RegisterComponent} from '../register/register.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
  ],
    declarations: [FolderPage, HomeComponent, AuthComponent, RegisterComponent]
})
export class FolderPageModule {}
