import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'connexion',
    loadChildren: () =>
      import('./Pages/Connexion/connexion.module').then(
        (m) => m.ConnexionPageModule
      ),
  },
  {
    path: 'inscription',
    loadChildren: () => import('./Pages/Inscription/inscription.module').then( m => m.InscriptionPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./Pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./Pages/Client/Contact/contact.module').then(m => m.ContactPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
