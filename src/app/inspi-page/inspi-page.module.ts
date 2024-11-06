import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspiPagePageRoutingModule } from './inspi-page-routing.module';

import { InspiPagePage } from './inspi-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InspiPagePageRoutingModule
  ],
  declarations: [InspiPagePage]
})
export class InspiPagePageModule {}
