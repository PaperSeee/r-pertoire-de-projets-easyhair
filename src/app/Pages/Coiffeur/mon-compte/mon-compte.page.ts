import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/authentification.service';

@Component({
  selector: 'app-mon-compte',
  templateUrl: './mon-compte.page.html',
  styleUrls: ['./mon-compte.page.scss'],
})
export class MonComptePage implements OnInit {

  constructor(
    public authService: AuthentificationService, 
    public router: Router
  ) { }

  ngOnInit() {
  }

  async logout() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/connexion']);
    }).catch((error) => {
      console.log(error);
    });
  }

}
