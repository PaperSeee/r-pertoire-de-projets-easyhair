import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesInformationsCoiffeurPage } from './mes-informations-coiffeur.page';

const routes: Routes = [
  {
    path: '',
    component: MesInformationsCoiffeurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesInformationsCoiffeurPageRoutingModule {}
