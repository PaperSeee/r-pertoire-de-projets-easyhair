import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/authentification.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss']
})
export class ProfilPage implements OnInit {
  user: any;

  constructor(public authService: AuthentificationService, public router: Router) { }

  ngOnInit() {
    this.loadProfile();
  }

  async loadProfile() {
    try {
      this.user = await this.authService.getProfile();
      console.log('Profil chargé:', this.user);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  }

  async logout() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/connexion']);
    }).catch((error) => {
      console.log(error);
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
