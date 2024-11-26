import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/authentification.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {

  // déclaration du formulaire d'inscription
  regForm: FormGroup;

  constructor(public formBuilder:FormBuilder, public loadingCtrl: LoadingController, public authService:AuthentificationService, public router: Router) { }

  ngOnInit() {
    this.regForm = this.formBuilder.group({

      // déclaration des patterns de l'username, l'email et le password
      prénom: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      genre: ['', [Validators.required]],


    
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
      ]],

      telephone: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{10}$')
      ]], // Nouveau contrôle

  
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ]]

    })
  }

  get errorControl() {
    return this.regForm?.controls;
  }

  // fonction pour s'inscrire
  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
    
    if (this.regForm?.valid) {
      try {
        const user = await this.authService.registerUser(
          this.regForm.value.email,
          this.regForm.value.password,
          this.regForm.value.prénom,
          this.regForm.value.nom,
          this.regForm.value.genre,
          this.regForm.value.telephone
        );

        if (user) {
          loading.dismiss();
          this.router.navigate(['/tabs/accueil']);
        }
      } catch (error) {
        console.log(error);
        loading.dismiss();
      }
    }
  }
  

}
