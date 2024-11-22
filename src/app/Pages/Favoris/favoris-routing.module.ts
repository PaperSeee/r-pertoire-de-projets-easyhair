import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavorisPage } from './favoris.page';

const routes: Routes = [
  {
    path: '',
    component: FavorisPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavorisPageRoutingModule {}
