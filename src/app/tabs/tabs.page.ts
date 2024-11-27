import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  selectedTab: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialiser la tab sélectionnée au chargement
    this.setSelectedTabFromUrl(this.router.url);

    // S'abonner aux changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.setSelectedTabFromUrl(event.url);
    });
  }

  setSelectedTabFromUrl(url: string) {
    if (url.includes('/accueil')) {
      this.selectedTab = 'accueil';
    } else if (url.includes('/favoris')) {
      this.selectedTab = 'favoris';
    } else if (url.includes('/profil')) {
      this.selectedTab = 'profil';
    }
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
