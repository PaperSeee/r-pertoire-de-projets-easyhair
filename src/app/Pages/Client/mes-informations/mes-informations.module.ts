import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MesInformationsPageRoutingModule } from './mes-informations-routing.module';
import { MesInformationsPage } from './mes-informations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MesInformationsPageRoutingModule
  ],
  declarations: [MesInformationsPage]
})
export class MesInformationsPageModule {}
