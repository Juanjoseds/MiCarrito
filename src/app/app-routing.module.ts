import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {SlidesComponent} from './slides/slides.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'Inicio',
    pathMatch: 'full'
  },
  {
    path: ':id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'slides',
    component: SlidesComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
