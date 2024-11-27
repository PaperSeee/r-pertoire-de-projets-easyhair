import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/authentification.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {

  // déclaration du formulaire d'inscription
  regForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public authService: AuthentificationService,
    public router: Router
  ) { }

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      prénom: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      genre: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
      ]],
      telephone: ['', [
        Validators.pattern('^[0-9]{9,13}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ]]
    });
  }

  get errorControl() {
    return this.regForm?.controls;
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

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
          this.router.navigate(['/tabs/accueil']);
        }
      } catch (error) {
        console.log(error);
        this.presentToast('Une erreur est survenue lors de l\'inscription.');
      } finally {
        loading.dismiss();
      }
    } else {
      loading.dismiss();
      if (this.errorControl['email'].errors) {
        this.presentToast('Email invalide.');
      }
      if (this.errorControl['password'].errors) {
        this.presentToast('Mot de passe invalide. Il doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.');
      }
      if (this.errorControl['telephone'].errors) {
        this.presentToast('Numéro de téléphone invalide. Il doit contenir 10 chiffres.');
      }
    }
  }
}
