import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'accueil',
        loadChildren: () =>
          import('../Pages/Client/Accueil/accueil.module').then((m) => m.AccueilPageModule),
      },
      {
        path: 'favoris',
        loadChildren: () =>
          import('../Pages/Client/Favoris/favoris.module').then((m) => m.FavorisPageModule),
      },
      {
        path: 'profil',
        loadChildren: () =>
          import('../Pages/Client/Profil/profil.module').then((m) => m.ProfilPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/accueil',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/accueil',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]  // Ajout de l'export du RouterModule
})
export class TabsPageRoutingModule {}
