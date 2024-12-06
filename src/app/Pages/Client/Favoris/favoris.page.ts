import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../../services/favorites.service';

@Component({
  selector: 'app-favoris',
  templateUrl: 'favoris.page.html',
  styleUrls: ['favoris.page.scss'],
})
export class FavorisPage implements OnInit {
  favoriteBarbers: any[] = [];

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  private loadFavorites() {
    this.favoritesService.getFavorites().subscribe(favorites => {
      this.favoriteBarbers = favorites;
    });
  }
}
