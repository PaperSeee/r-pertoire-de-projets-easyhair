import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InscriptionProfessionnelsPageRoutingModule } from './inscription-professionnels-routing.module';

import { InscriptionProfessionnelsPage } from './inscription-professionnels.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    InscriptionProfessionnelsPageRoutingModule
  ],
  declarations: [InscriptionProfessionnelsPage]
})
export class InscriptionProfessionnelsPageModule {}
