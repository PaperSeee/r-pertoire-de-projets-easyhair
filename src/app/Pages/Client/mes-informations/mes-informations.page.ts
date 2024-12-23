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
  
  // Ajouter la liste des communes
  communes = [
    "Anderlecht (1070)", "Auderghem (1160)", "Berchem-Sainte-Agathe (1082)",
    "Bruxelles (1000)", "Etterbeek (1040)", "Evere (1140)", 
    "Forest (1190)", "Ganshoren (1083)", "Ixelles (1050)",
    "Jette (1090)", "Koekelberg (1081)", "Molenbeek-Saint-Jean (1080)",
    "Saint-Gilles (1060)", "Saint-Josse-ten-Noode (1210)", 
    "Schaerbeek (1030)", "Uccle (1180)", "Watermael-Boitsfort (1170)",
    "Woluwe-Saint-Lambert (1200)", "Woluwe-Saint-Pierre (1150)"
  ];

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
      prénom: ['', [Validators.required]],
      nom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{9,13}$')]],
      genre: ['', [Validators.required]],
      rue: ['', [Validators.required]],
      commune: ['', [Validators.required]]
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
            commune: userData['adresse']?.commune || ''
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
              commune: formData.commune || ''
            }
          };
          
          // Supprimer les champs individuels de l'adresse
          delete userData.rue;
          delete userData.commune;
          
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
