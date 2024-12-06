import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForfaitPage } from './forfait.page';

const routes: Routes = [
  {
    path: '',
    component: ForfaitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForfaitPageRoutingModule {}
