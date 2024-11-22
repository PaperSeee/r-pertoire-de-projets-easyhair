import { Component } from '@angular/core';

@Component({
  selector: 'app-accueil',
  templateUrl: 'accueil.page.html',
  styleUrls: ['accueil.page.scss']
})
export class AccueilPage {
  barbers = [];
  currentPage = 1;

  constructor() {
    // Charger les données initiales
    this.loadBarbers();
  }

  loadBarbers(event?) {
    // Simuler le chargement de 10 coiffeurs à la fois
    for (let i = 0; i < 10; i++) {
      this.barbers.push({
        name: 'Hairmomo ' + (this.barbers.length + 1),
        type: 'Barber professionel',
        price: '20€-30€',
        rating: 4.5,
        image: '../../../assets/icon/image 4.png',
        profile: '../../../assets/icon/pp.png'
      });
    }

    if (event) {
      event.target.complete();
    }
  }

  loadMore(event) {
    this.currentPage++;
    this.loadBarbers(event);
  }
}
