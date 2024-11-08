import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageDInscriptionPage } from './page-d-inscription.page';

const routes: Routes = [
  {
    path: '',
    component: PageDInscriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageDInscriptionPageRoutingModule {}
