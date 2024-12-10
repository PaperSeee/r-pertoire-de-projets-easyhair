import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../../services/favorites.service';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-detail-barber',
  templateUrl: './detail-barber.page.html',
  styleUrls: ['./detail-barber.page.scss']
})
export class DetailBarberPage implements OnInit, OnDestroy {
  barber: any = {};
  isFavorite = false;
  private firestore = getFirestore();
  private favoriteStatusSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const barberId = params.get('id');
      if (barberId) {
        await this.loadBarberData(barberId);
      }
    });
  }

  ngOnDestroy() {
    if (this.favoriteStatusSubscription) {
      this.favoriteStatusSubscription.unsubscribe();
    }
  }

  private async loadBarberData(barberId: string) {
    try {
      const barberDoc = await getDoc(doc(this.firestore, 'Coiffeurs', barberId));
      if (barberDoc.exists()) {
        this.barber = {
          id: barberDoc.id,
          ...barberDoc.data()
        };
        this.subscribeToFavoriteStatus();
      }
    } catch (error) {
      console.error('Erreur lors du chargement du barbier:', error);
      this.router.navigate(['/']);
    }
  }

  private subscribeToFavoriteStatus() {
    if (this.favoriteStatusSubscription) {
      this.favoriteStatusSubscription.unsubscribe();
    }
    this.favoriteStatusSubscription = this.favoritesService
      .getFavoriteStatus(this.barber.id)
      .subscribe(status => {
        this.isFavorite = status;
      });
  }

  toggleFavorite() {
    if (this.isFavorite) {
      this.favoritesService.removeFromFavorites(this.barber.id);
    } else {
      this.favoritesService.addToFavorites(this.barber);
    }
  }
}
