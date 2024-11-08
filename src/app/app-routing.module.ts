import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'page-de-connexion',
    loadChildren: () =>
      import('./Pages/page-de-connexion/page-de-connexion.module').then(
        (m) => m.PageDeConnexionPageModule
      ),
  },
  {
    path: 'page-d-inscription',
    loadChildren: () => import('./Pages/page-d-inscription/page-d-inscription.module').then( m => m.PageDInscriptionPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./Pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
