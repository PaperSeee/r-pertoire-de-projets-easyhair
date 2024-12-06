import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: any[] = [];
  private favoritesSubject = new BehaviorSubject<any[]>([]);

  getFavorites() {
    return this.favoritesSubject.asObservable();
  }

  addToFavorites(barber: any) {
    if (!this.isFavorite(barber)) {
      this.favorites.push(barber);
      this.favoritesSubject.next(this.favorites);
    }
  }

  removeFromFavorites(barber: any) {
    this.favorites = this.favorites.filter(b => b.name !== barber.name);
    this.favoritesSubject.next(this.favorites);
  }

  isFavorite(barber: any): boolean {
    return this.favorites.some(b => b.name === barber.name);
  }
}
