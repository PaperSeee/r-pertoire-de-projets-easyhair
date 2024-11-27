import { Component } from '@angular/core';

@Component({
  selector: 'app-favoris',
  templateUrl: 'favoris.page.html',
  styleUrls: ['favoris.page.scss'],
})
export class FavorisPage {
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
        image: '../../../../assets/icon/image 4.png',
        profile: '../../../../assets/icon/image 4.png',
      });
    }

    if (event) {
      event.target.complete();
    }
  }

  // loadMore(event) {
  //   this.currentPage++;
  //   this.loadBarbers(event);
  // }
}
