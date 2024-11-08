import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageDInscriptionPageRoutingModule } from './page-d-inscription-routing.module';

import { PageDInscriptionPage } from './page-d-inscription.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PageDInscriptionPageRoutingModule
  ],
  declarations: [PageDInscriptionPage]
})
export class PageDInscriptionPageModule {}
