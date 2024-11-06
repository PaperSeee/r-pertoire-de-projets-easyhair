import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'login-page',
    loadChildren: () =>
      import('./login-page/login-page.module').then(
        (m) => m.LoginPagePageModule
      ),
  },
  {
    path: 'home-page',
    loadChildren: () =>
      import('./home-page/home-page.module').then((m) => m.HomePagePageModule),
  },
  {
    path: 'profile-page',
    loadChildren: () =>
      import('./profile-page/profile-page.module').then(
        (m) => m.ProfilePagePageModule
      ),
  },
  {
    path: 'fav-page',
    loadChildren: () =>
      import('./fav-page/fav-page.module').then((m) => m.FavPagePageModule),
  },
  {
    path: 'inspi-page',
    loadChildren: () =>
      import('./inspi-page/inspi-page.module').then(
        (m) => m.InspiPagePageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
