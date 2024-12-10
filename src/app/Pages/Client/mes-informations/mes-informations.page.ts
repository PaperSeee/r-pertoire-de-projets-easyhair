import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/authentification.service';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-mes-informations',
  templateUrl: './mes-informations.page.html',
  styleUrls: ['./mes-informations.page.scss'],
})
export class MesInformationsPage implements OnInit {
  userForm: FormGroup;
  private firestore = getFirestore();
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthentificationService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadUserData();
  }

  private initForm() {
    this.userForm = this.formBuilder.group({
      prénom: ['', Validators.required],
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.pattern('^[0-9]{9,13}$')],
      genre: ['', Validators.required],
      // Nouveaux champs pour l'adresse
      rue: [''],
      codePostal: [''],
      ville: ['']
    });
  }

  private async loadUserData() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      const user = await this.authService.getProfile();
      if (user) {
        const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Aplatir l'objet adresse pour le formulaire
          const formData = {
            ...userData,
            rue: userData['adresse']?.rue || '',
            codePostal: userData['adresse']?.codePostal || '',
            ville: userData['adresse']?.ville || ''
          };
          this.userForm.patchValue(formData);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      this.presentToast('Erreur lors du chargement des données');
    } finally {
      loading.dismiss();
    }
  }

  async updateProfile() {
    if (this.userForm.valid) {
      const loading = await this.loadingCtrl.create();
      await loading.present();

      try {
        const user = await this.authService.getProfile();
        if (user) {
          const userRef = doc(this.firestore, 'users', user.uid);
          const formData = this.userForm.value;
          
          // Créer l'objet adresse
          const userData = {
            ...formData,
            adresse: {
              rue: formData.rue || '',
              codePostal: formData.codePostal || '',
              ville: formData.ville || ''
            }
          };
          
          // Supprimer les champs individuels de l'adresse
          delete userData.rue;
          delete userData.codePostal;
          delete userData.ville;
          
          await updateDoc(userRef, userData);
          this.presentToast('Profil mis à jour avec succès');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        this.presentToast('Erreur lors de la mise à jour du profil');
      } finally {
        loading.dismiss();
      }
    }
  }

  private async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
