import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavPagePageRoutingModule } from './fav-page-routing.module';

import { FavPagePage } from './fav-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavPagePageRoutingModule
  ],
  declarations: [FavPagePage]
})
export class FavPagePageModule {}
