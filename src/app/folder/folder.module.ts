import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import {HomeComponent} from '../home/home.component';
import {AuthComponent} from '../auth/auth.component';
import {RegisterComponent} from '../register/register.component';
import {EditComponent} from '../edit/edit.component';
import {PopoverComponent} from '../popover/popover.component';
import {SavedComponent} from '../saved/saved.component';
import {SettingsComponent} from '../settings/settings.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
  ],
    declarations: [FolderPage, HomeComponent, AuthComponent, RegisterComponent,
      EditComponent, PopoverComponent, SavedComponent, SettingsComponent]
})
export class FolderPageModule {}
