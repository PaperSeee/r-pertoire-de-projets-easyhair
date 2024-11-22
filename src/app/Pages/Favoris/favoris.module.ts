import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavorisPage } from './favoris.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { FavorisPageRoutingModule } from './favoris-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FavorisPageRoutingModule,
  ],
  declarations: [FavorisPage],
})
export class FavorisPageModule {}
