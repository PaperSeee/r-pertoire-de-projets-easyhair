import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-coiffeur-tabs',
  templateUrl: './coiffeur-tabs.page.html',
  styleUrls: ['./coiffeur-tabs.page.scss'],
})
export class CoiffeurTabsPage implements OnInit {
  selectedTab: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.setSelectedTabFromUrl(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.setSelectedTabFromUrl(event.url);
    });
  }

  setSelectedTabFromUrl(url: string) {
    if (url.includes('/dashboard')) {
      this.selectedTab = 'dashboard';
    } else if (url.includes('/agenda')) {
      this.selectedTab = 'agenda';
    } else if (url.includes('/mon-compte')) {
      this.selectedTab = 'mon-compte';
    }
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
