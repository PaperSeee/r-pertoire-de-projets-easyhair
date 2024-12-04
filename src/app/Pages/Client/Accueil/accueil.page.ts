import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss']
})
export class AccueilPage implements OnInit {
  barbers = [];
  currentPage = 1;

  constructor(private router: Router) { }

  ngOnInit() {
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
        profile: '../../../../assets/icon/pp.png'
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

  goToBarberDetails(barber) {
    this.router.navigate(['/detail-barber'], {
      state: { data: barber }
    });
  }
}
