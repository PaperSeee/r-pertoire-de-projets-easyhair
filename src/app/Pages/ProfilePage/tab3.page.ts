import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/authentification.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {

  user:any

  constructor(public authService:AuthentificationService, public router:Router) {
    this.user = authService.getProfile()
  }

  // fonction pour se déconnecter
  async logout(){
    this.authService.signOut().then(()=>{
      this.router.navigate(['/page-de-connexion'])
    }).catch((error)=>{
       console.log(error);
    })
  }

}
