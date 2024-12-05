import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonProfilCoiffeurPageRoutingModule } from './mon-profil-coiffeur-routing.module';

import { MonProfilCoiffeurPage } from './mon-profil-coiffeur.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonProfilCoiffeurPageRoutingModule
  ],
  declarations: [MonProfilCoiffeurPage]
})
export class MonProfilCoiffeurPageModule {}
