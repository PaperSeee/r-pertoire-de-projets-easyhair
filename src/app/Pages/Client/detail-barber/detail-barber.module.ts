import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DetailBarberPage } from './detail-barber.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: DetailBarberPage
      }
    ])
  ],
  declarations: [DetailBarberPage]
})
export class DetailBarberPageModule { }
