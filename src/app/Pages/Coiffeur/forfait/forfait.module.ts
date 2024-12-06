import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForfaitPageRoutingModule } from './forfait-routing.module';

import { ForfaitPage } from './forfait.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForfaitPageRoutingModule
  ],
  declarations: [ForfaitPage]
})
export class ForfaitPageModule {}
