import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavoritesService } from '../../../services/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favoris',
  templateUrl: 'favoris.page.html',
  styleUrls: ['favoris.page.scss'],
})
export class FavorisPage implements OnInit, OnDestroy {
  favoriteBarbers: any[] = [];
  private subscription?: Subscription;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadFavorites() {
    this.subscription = this.favoritesService.getFavorites().subscribe(favorites => {
      console.log('Favoris chargés:', favorites); // Debug
      this.favoriteBarbers = favorites.map(favorite => ({
        ...favorite,
        photosCoupes: favorite.photosCoupes || [],
        typeCoiffeur: favorite.typeCoiffeur || [],
        tarifs: favorite.tarifs || []
      }));
    });
  }

  // Méthode utilitaire pour vérifier si un coiffeur a toutes les données nécessaires
  isValidBarber(coiffeur: any): boolean {
    return coiffeur && coiffeur.id && coiffeur.nomCoiffeur;
  }

  getPrix(tarif: string | undefined): string {
    if (!tarif) return '';
    const parts = tarif.split('(');
    return parts.length > 1 ? parts[1].replace(')', '') : tarif;
  }
}
