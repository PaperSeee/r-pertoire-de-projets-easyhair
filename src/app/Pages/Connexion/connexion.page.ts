import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, isPlatform, ToastController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/authentification.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

// Import Firebase Modular SDK
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { environment } from 'src/environments/environment'; // Ajustez en fonction de la configuration de votre projet

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
})
export class ConnexionPage implements OnInit {
  user = null;
  loginForm: FormGroup;

  // Initialisez l'application Firebase
  private firebaseApp = initializeApp(environment.firebaseConfig);
  private auth = getAuth(this.firebaseApp);

  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public authService: AuthentificationService
  ) {
    if (!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern("[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$"),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"),
        ],
      ],
    });
  }

  get errorControl() {
    return this.loginForm?.controls;
  }

  async login() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.loginForm?.valid) {
      try {
        const user = await this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password);
        if (user) {
          this.router.navigate(['/tabs/accueil']);
        } else {
          this.showErrorToast('Adresse email ou mot de passe incorrect');
        }
      } catch (error) {
        console.log(error);
        this.showErrorToast('Adresse email ou mot de passe incorrect');
      } finally {
        loading.dismiss();
      }
    } else {
      loading.dismiss();
      this.showErrorToast('Formulaire invalide');
    }
  }

  async showErrorToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: 'danger',
      position: 'top'
    });
    toast.present();
  }

  async signInWithGoogle() {
    try {
      const googleUser = await GoogleAuth.signIn();
      console.log('user :', googleUser);

      // Vérifiez que toutes les propriétés nécessaires sont présentes
      if (!googleUser.authentication.idToken) {
        throw new Error('Informations utilisateur manquantes');
      }

      // Enregistrer l'utilisateur dans Firebase Authentication
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      const userCredential = await signInWithCredential(this.auth, credential);

      console.log('userCredential :', userCredential);

      this.router.navigate(['/tabs/accueil']);
    } catch (error) {
      console.log('Google sign-in error:', error);
    }
  }
}

