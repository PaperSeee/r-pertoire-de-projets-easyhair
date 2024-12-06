import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../../services/favorites.service';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

@Component({
  selector: 'app-detail-barber',
  templateUrl: './detail-barber.page.html',
  styleUrls: ['./detail-barber.page.scss']
})
export class DetailBarberPage implements OnInit {
  barber: any = {};
  isFavorite = false;
  private firestore = getFirestore();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  async ngOnInit() {
    try {
      const barberId = this.route.snapshot.paramMap.get('id');
      if (barberId) {
        const barberDoc = await getDoc(doc(this.firestore, 'Coiffeurs', barberId));
        if (barberDoc.exists()) {
          this.barber = {
            id: barberDoc.id,
            ...barberDoc.data()
          };
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du barbier:', error);
      this.router.navigate(['/']);
    }
    this.checkIfFavorite();
  }

  toggleFavorite() {
    if (this.isFavorite) {
      this.favoritesService.removeFromFavorites(this.barber);
    } else {
      this.favoritesService.addToFavorites(this.barber);
    }
    this.isFavorite = !this.isFavorite;
  }

  private checkIfFavorite() {
    this.isFavorite = this.favoritesService.isFavorite(this.barber);
  }
}
