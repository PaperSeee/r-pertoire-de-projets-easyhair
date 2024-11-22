import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// ajout de ReactiveFormsModule pour le systeme d'authentification
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnexionPageRoutingModule } from './connexion-routing.module';

import { ConnexionPage } from './connexion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ConnexionPageRoutingModule
  ],
  declarations: [ConnexionPage]
})
export class ConnexionPageModule {}
