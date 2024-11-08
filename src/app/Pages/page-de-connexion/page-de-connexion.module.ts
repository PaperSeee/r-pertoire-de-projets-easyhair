import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// ajout de ReactiveFormsModule pour le systeme d'authentification
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageDeConnexionPageRoutingModule } from './page-de-connexion-routing.module';

import { PageDeConnexionPage } from './page-de-connexion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PageDeConnexionPageRoutingModule
  ],
  declarations: [PageDeConnexionPage]
})
export class PageDeConnexionPageModule {}
