import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: any[] = [];
  private favoritesSubject = new BehaviorSubject<any[]>([]);
  private favoriteStatusMap = new BehaviorSubject<{[key: string]: boolean}>({});

  constructor() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      this.favorites = JSON.parse(savedFavorites);
      this.updateFavoriteStatusMap();
      this.favoritesSubject.next(this.favorites);
    }
  }

  getFavorites(): Observable<any[]> {
    return this.favoritesSubject.asObservable();
  }

  getFavoriteStatus(barberId: string): Observable<boolean> {
    return new Observable(observer => {
      this.favoriteStatusMap.subscribe(statusMap => {
        observer.next(!!statusMap[barberId]);
      });
    });
  }

  addToFavorites(barber: any) {
    if (!barber || !barber.id) return;
    
    const index = this.favorites.findIndex(b => b.id === barber.id);
    if (index === -1) {
      // S'assurer que toutes les propriétés nécessaires sont présentes
      const favoriteBarber = {
        id: barber.id,
        nomCoiffeur: barber.nomCoiffeur,
        photoURL: barber.photoURL,
        photosCoupes: barber.photosCoupes || [],
        typeCoiffeur: barber.typeCoiffeur || [],
        tarifs: barber.tarifs || []
      };
      
      this.favorites = [...this.favorites, favoriteBarber];
      this.updateStorage();
    }
  }

  removeFromFavorites(barberId: string) {
    this.favorites = this.favorites.filter(b => b.id !== barberId);
    this.updateStorage();
  }

  isFavorite(barberId: string): boolean {
    return barberId ? this.favorites.some(b => b.id === barberId) : false;
  }

  private updateStorage() {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    this.updateFavoriteStatusMap();
    this.favoritesSubject.next([...this.favorites]);
  }

  private updateFavoriteStatusMap() {
    const statusMap = this.favorites.reduce((acc, barber) => {
      acc[barber.id] = true;
      return acc;
    }, {} as {[key: string]: boolean});
    this.favoriteStatusMap.next(statusMap);
  }
}
