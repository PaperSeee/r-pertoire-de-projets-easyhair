import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/authentification.service';

@Component({
  selector: 'app-page-de-connexion',
  templateUrl: './page-de-connexion.page.html',
  styleUrls: ['./page-de-connexion.page.scss'],
})
export class PageDeConnexionPage implements OnInit {

  // déclaration du formulaire de connexion
  loginForm: FormGroup;

  constructor(public router: Router, public formBuilder:FormBuilder, public loadingCtrl: LoadingController, public authService:AuthentificationService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      
      // déclaration des patterns de l'email
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
      ]],
  
      // déclaration des patterns du password
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ]]

    })
  }

  get errorControl() {
    return this.loginForm?.controls;
  }

  // fonction pour se connecter
  async login(){
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if(this.loginForm?.valid){
      const user = await this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).catch((error) =>{
        console.log(error);
        loading.dismiss()
      })

      if(user){
        loading.dismiss()
        this.router.navigate(['/tabs/tab1'])
      } else{
        console.log('Veuillez entrer des valeurs correctes');
      }
    }
    
  }
  
}
