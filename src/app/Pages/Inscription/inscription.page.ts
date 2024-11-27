import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, isPlatform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { AuthentificationService } from 'src/app/authentification.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {

  // déclaration du formulaire d'inscription
  regForm: FormGroup;
  private firebaseApp = initializeApp(environment.firebaseConfig);
  private auth = getAuth(this.firebaseApp);

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public authService: AuthentificationService,
    public router: Router
  ) {
    // Déplacer l'initialisation dans un try-catch
    try {
      if (!isPlatform('capacitor')) {
        GoogleAuth.initialize({
          clientId: environment.googleClientId,
          scopes: ['profile', 'email'],
          grantOfflineAccess: true
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Google Auth:', error);
    }
  }

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

  async signUpWithGoogle() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
  
    try {
      const googleUser = await GoogleAuth.signIn();
      console.log('Google user:', googleUser);
  
      if (!googleUser.authentication.idToken) {
        throw new Error('Informations utilisateur manquantes');
      }
  
      // Créer les credentials Firebase
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      const userCredential = await signInWithCredential(this.auth, credential);
  
      // Vérifier si l'utilisateur existe déjà dans Firestore
      const userExists = await this.authService.userExists(userCredential.user.uid);
  
      // Préparer les données utilisateur
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        prénom: googleUser.givenName || '',
        nom: googleUser.familyName || '',
        telephone: '',
        genre: '',
        photoURL: userCredential.user.photoURL || '',
        createdAt: userExists ? undefined : new Date().toISOString(), // N'ajouter cette date que pour un nouvel utilisateur
        role: 'user',
        emailVerified: userCredential.user.emailVerified
      };
  
      // Enregistrer ou mettre à jour les données utilisateur dans Firestore
      await this.authService.registerUserWithGoogle(userData);
  
      await loading.dismiss();
      this.router.navigate(['/tabs/accueil']);
    } catch (error) {
      await loading.dismiss();
      console.error('Google sign-up error:', error);
      this.presentToast('Erreur lors de l\'inscription avec Google');
    }
  }
  
}



