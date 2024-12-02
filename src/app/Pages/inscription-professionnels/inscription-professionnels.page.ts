import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/authentification.service';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inscription-professionnels',
  templateUrl: './inscription-professionnels.page.html',
  styleUrls: ['./inscription-professionnels.page.scss'],
})
export class InscriptionProfessionnelsPage implements OnInit {
  regForm: FormGroup;
  private firebaseApp = initializeApp(environment.firebaseConfig);
  private auth = getAuth(this.firebaseApp);

  communes = [
    "Anderlecht (1070)", "Auderghem (1160)", "Berchem-Sainte-Agathe (1082)",
    "Bruxelles (1000)", "Etterbeek (1040)", "Evere (1140)", 
    "Forest (1190)", "Ganshoren (1083)", "Ixelles (1050)",
    "Jette (1090)", "Koekelberg (1081)", "Molenbeek-Saint-Jean (1080)",
    "Saint-Gilles (1060)", "Saint-Josse-ten-Noode (1210)", 
    "Schaerbeek (1030)", "Uccle (1180)", "Watermael-Boitsfort (1170)",
    "Woluwe-Saint-Lambert (1200)", "Woluwe-Saint-Pierre (1150)"
  ];

  typeCoiffeur = [
    "Barber",
    "Coiffeur homme",
    "Coiffeur femme"
  ];

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, 
    public toastCtrl: ToastController,
    public authService: AuthentificationService,
    public router: Router
  ) {}

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      nomCoiffeur: ['', [Validators.required]],
      prénom: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      genre: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.pattern("[a-z0-9._%+\\-]+@gmail\\.com$")
      ]],
      telephone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{9,13}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ]],
      typeCoiffeur: [[], [Validators.required]],
      communes: [[], [Validators.required]]
    });
  }

  get errorControl() {
    return this.regForm?.controls;
  }

  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.regForm?.valid) {
      try {
        console.log('Données du formulaire:', this.regForm.value); // Log de débogage
        const user = await this.authService.registerProfessional(
          this.regForm.value.email,
          this.regForm.value.password,
          {
            nomCoiffeur: this.regForm.value.nomCoiffeur,
            prénom: this.regForm.value.prénom,
            nom: this.regForm.value.nom,
            genre: this.regForm.value.genre,
            telephone: this.regForm.value.telephone,
            typeCoiffeur: this.regForm.value.typeCoiffeur,
            communes: this.regForm.value.communes,
            role: 'professionel'
          }
        );
        console.log('Utilisateur créé:', user); // Log de débogage

        if (user) {
          this.router.navigate(['/dashboard']);
        }
      } catch (error) {
        console.error('Erreur détaillée:', error); // Log d'erreur amélioré
        this.presentToast('Une erreur est survenue lors de l\'inscription.');
      } finally {
        loading.dismiss();
      }
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
