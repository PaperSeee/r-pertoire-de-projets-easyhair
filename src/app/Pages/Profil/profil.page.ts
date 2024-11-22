import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/authentification.service';

@Component({
  selector: 'app-profil',
  templateUrl: 'profil.page.html',
  styleUrls: ['profil.page.scss']
})
export class ProfilPage {
  user: any;

  constructor(public authService: AuthentificationService, public router: Router) {
    this.user = authService.getProfile()
  }

  async logout() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/connexion'])
    }).catch((error) => {
      console.log(error);
    })
  }
}
