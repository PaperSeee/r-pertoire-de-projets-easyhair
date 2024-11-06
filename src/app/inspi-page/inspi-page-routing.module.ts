import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InspiPagePage } from './inspi-page.page';

const routes: Routes = [
  {
    path: '',
    component: InspiPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InspiPagePageRoutingModule {}
