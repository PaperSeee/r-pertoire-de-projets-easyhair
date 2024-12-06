import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService } from '../../../services/favorites.service';

@Component({
  selector: 'app-detail-barber',
  templateUrl: './detail-barber.page.html',
  styleUrls: ['./detail-barber.page.scss']
})
export class DetailBarberPage implements OnInit {
  barber: any = {};
  isFavorite = false;

  constructor(
    private router: Router,
    private favoritesService: FavoritesService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.barber = navigation.extras.state['data'];
    }
  }

  ngOnInit() {
    if (!this.barber) {
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
