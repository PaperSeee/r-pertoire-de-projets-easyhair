import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesHorairesPageRoutingModule } from './mes-horaires-routing.module';

import { MesHorairesPage } from './mes-horaires.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesHorairesPageRoutingModule
  ],
  declarations: [MesHorairesPage]
})
export class MesHorairesPageModule {}
