import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonProfilCoiffeurPage } from './mon-profil-coiffeur.page';

const routes: Routes = [
  {
    path: '',
    component: MonProfilCoiffeurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonProfilCoiffeurPageRoutingModule {}
