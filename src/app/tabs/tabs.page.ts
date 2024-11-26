import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  selectedTab: string = ''; // Onglet sélectionné par défaut
  selectTab(tab: string) {
    this.selectedTab = tab; // Met à jour l'onglet sélectionné
  }
}
