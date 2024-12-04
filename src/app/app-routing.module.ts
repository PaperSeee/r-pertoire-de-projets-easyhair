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
  {
    path: 'dashboard',
    loadChildren: () => import('./Pages/Coiffeur/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'agenda',
    loadChildren: () => import('./Pages/Coiffeur/agenda/agenda.module').then( m => m.AgendaPageModule)
  },
  {
    path: 'mon-compte',
    loadChildren: () => import('./Pages/Coiffeur/mon-compte/mon-compte.module').then( m => m.MonComptePageModule)
  },
  {
    path: 'mes-informations',
    loadChildren: () => import('./Pages/Client/mes-informations/mes-informations.module').then( m => m.MesInformationsPageModule)
  },
  {
    path: 'inscription-professionnels',
    loadChildren: () => import('./Pages/inscription-professionnels/inscription-professionnels.module').then( m => m.InscriptionProfessionnelsPageModule)
  },
  {
    path: 'coiffeur-tabs',
    loadChildren: () => import('./Pages/Coiffeur/coiffeur-tabs/coiffeur-tabs.module').then( m => m.CoiffeurTabsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
