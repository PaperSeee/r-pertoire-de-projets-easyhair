import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoiffeurTabsPageRoutingModule } from './coiffeur-tabs-routing.module';

import { CoiffeurTabsPage } from './coiffeur-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoiffeurTabsPageRoutingModule
  ],
  declarations: [CoiffeurTabsPage]
})
export class CoiffeurTabsPageModule {}
