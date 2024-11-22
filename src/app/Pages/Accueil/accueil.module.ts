import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccueilPage } from './accueil.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { AccueilPageRoutingModule } from './accueil-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AccueilPageRoutingModule,
  ],
  declarations: [AccueilPage],
})
export class AccueilPageModule {}
