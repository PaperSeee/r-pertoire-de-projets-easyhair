import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, isPlatform, ToastController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/authentification.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
    public authService: AuthentificationService,
    private firestore: AngularFirestore
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
        const user = await this.authService.loginUser(
          this.loginForm.value.email, 
          this.loginForm.value.password
        );
        
        if (user) {
          // Vérifier uniquement dans la collection coiffeurs
          const coiffeurDoc = await this.firestore
            .collection('Coiffeurs')
            .doc(user.user.uid)
            .get()
            .toPromise();

          if (coiffeurDoc?.exists) {
            // C'est un professionnel
            this.router.navigate(['/coiffeur-tabs/dashboard']);
          } else {
            // C'est un utilisateur normal
            this.router.navigate(['/tabs/accueil']);
          }
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

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
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
  
      if (!userExists) {
        // Préparer les données utilisateur uniquement si c'est un nouvel utilisateur
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          prénom: googleUser.givenName || '',
          nom: googleUser.familyName || '',
          telephone: '',
          genre: '',
          photoURL: userCredential.user.photoURL || '',
          createdAt: new Date().toISOString(),
          role: 'user',
          emailVerified: userCredential.user.emailVerified
        };
  
        // Enregistrer dans Firestore uniquement pour un nouvel utilisateur
        await this.authService.registerUserWithGoogle(userData);
      }
  
      await loading.dismiss();
      this.router.navigate(['/tabs/accueil']);
    } catch (error) {
      await loading.dismiss();
      console.error('Google sign-up error:', error);
      this.presentToast('Erreur lors de l\'inscription avec Google');
    }
  }

}

