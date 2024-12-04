import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoiffeurTabsPage } from './coiffeur-tabs.page';

const routes: Routes = [
  {
    path: '',  // Ajout de la route parent
    component: CoiffeurTabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => 
          import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'agenda',
        loadChildren: () => 
          import('../agenda/agenda.module').then(m => m.AgendaPageModule)
      },
      {
        path: 'mon-compte',
        loadChildren: () => 
          import('../mon-compte/mon-compte.module').then(m => m.MonComptePageModule)
      },
      {
        path: '',
        redirectTo: '/coiffeur-tabs/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/coiffeur-tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoiffeurTabsPageRoutingModule {}
