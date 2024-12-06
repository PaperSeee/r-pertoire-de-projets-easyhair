import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrendreRdvPage } from './prendre-rdv.page';

const routes: Routes = [
  {
    path: '',
    component: PrendreRdvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrendreRdvPageRoutingModule {}
