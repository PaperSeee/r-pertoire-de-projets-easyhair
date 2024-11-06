import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavPagePage } from './fav-page.page';

const routes: Routes = [
  {
    path: '',
    component: FavPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavPagePageRoutingModule {}
