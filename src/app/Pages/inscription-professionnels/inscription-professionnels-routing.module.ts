import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InscriptionProfessionnelsPage } from './inscription-professionnels.page';

const routes: Routes = [
  {
    path: '',
    component: InscriptionProfessionnelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InscriptionProfessionnelsPageRoutingModule {}
