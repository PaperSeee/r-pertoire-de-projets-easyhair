import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesHorairesPage } from './mes-horaires.page';

const routes: Routes = [
  {
    path: '',
    component: MesHorairesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesHorairesPageRoutingModule {}
