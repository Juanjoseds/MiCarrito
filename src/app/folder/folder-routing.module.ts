import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';
import {RegisterComponent} from '../register/register.component';
import {EditComponent} from '../edit/edit.component';
import {SavedComponent} from '../saved/saved.component';
import {SettingsComponent} from '../settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: FolderPage
  },
  {
    path: '/register',
    component: RegisterComponent
  },
  {
    path: '/edit/:id',
    component: EditComponent
  },
  {
    path: '/saved',
    component: SavedComponent
  },
  {
    path: '/settings',
    component: SettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
