import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrendreRdvPageRoutingModule } from './prendre-rdv-routing.module';
import { PrendreRdvPage } from './prendre-rdv.page';
import GoogleCalendarService from '../../../services/google-calendar.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrendreRdvPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PrendreRdvPage],
  providers: [GoogleCalendarService]
})
export class PrendreRdvPageModule {}
