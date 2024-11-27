import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendaPageRoutingModule } from './agenda-routing.module';
import { AgendaPage } from './agenda.page';
import GoogleCalendarService from '../../../services/google-calendar.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AgendaPage],
  providers: [GoogleCalendarService]
})
export class AgendaPageModule { }
