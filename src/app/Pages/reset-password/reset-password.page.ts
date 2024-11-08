import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/authentification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  email:any

  constructor( public authService: AuthentificationService, public router:Router) { }

  ngOnInit() {
  }
  
  async resetPassword(){

    this.authService.resetPassword(this.email).then(()=>{

      console.log('reset link set');
      this.router.navigate(['/page-de-connexion'])

    }).catch((error)=>{

      console.log(error);
      
    })
  }

}
