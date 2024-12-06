import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/authentification.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-mon-profil-coiffeur',
  templateUrl: './mon-profil-coiffeur.page.html',
  styleUrls: ['./mon-profil-coiffeur.page.scss'],
})
export class MonProfilCoiffeurPage implements OnInit {
  photoProfil: string = '';
  photosCoupes: string[] = [];
  tarifs: string[] = [];
  nouveauTarif: string = '';
  private firestore = getFirestore();
  private storage = getStorage();

  typeCoiffeur = [
    "Barber",
    "Coiffeur homme",
    "Coiffeur femme"
  ];
  selectedTypes: string[] = [];

  constructor(
    private authService: AuthentificationService,
    private uploadService: UploadService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.loadProfileData();
  }

  private async loadProfileData() {
    let loading;
    try {
      loading = await this.loadingCtrl.create({
        message: 'Chargement...'
      });
      await loading.present();

      const user = await this.authService.getProfile();
      if (user) {
        const userRef = doc(this.firestore, 'Coiffeurs', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          this.photoProfil = data['photoURL'] || '';
          this.photosCoupes = data['photosCoupes'] || [];
          this.tarifs = data['tarifs'] || [];
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      this.presentToast('Erreur lors du chargement du profil');
    } finally {
      if (loading) {
        await loading.dismiss();
      }
    }
  }

  private async loadTypes() {
    try {
      const user = await this.authService.getProfile();
      if (user) {
        const docRef = doc(this.firestore, 'Coiffeurs', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.selectedTypes = docSnap.data()?.['typeCoiffeur'] || [];
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des types:', error);
      this.presentToast('Erreur lors du chargement des types');
    }
  }

  // Ajouter ionViewWillEnter pour recharger les données quand on revient sur la page
  async ionViewWillEnter() {
    await this.loadProfileData();
    await this.loadTypes();
  }

  async ajouterPhoto(type: 'profile' | 'hairstyle') {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      if (!image || !image.dataUrl) {
        throw new Error('Aucune image sélectionnée');
      }

      const loading = await this.loadingCtrl.create();
      await loading.present();

      try {
        const user = await this.authService.getProfile();
        if (user) {
          // Upload de l'image
          const url = await this.uploadService.uploadImage(user.uid, image.dataUrl, type);
          
          // Mise à jour Firestore
          await this.uploadService.updateUserPhoto(user.uid, url, type);

          // Mise à jour de l'interface
          if (type === 'profile') {
            this.photoProfil = url;
          } else {
            this.photosCoupes.push(url);
          }
          
          this.presentToast('Photo ajoutée avec succès');
        }
      } catch (error) {
        console.error('Erreur:', error);
        this.presentToast('Erreur lors de l\'ajout de la photo');
      } finally {
        loading.dismiss();
      }
    } catch (error) {
      console.error('Erreur lors de la sélection:', error);
      this.presentToast('Erreur lors de la sélection de l\'image');
    }
  }

  async ajouterTarif() {
    if (this.nouveauTarif.trim()) {
      try {
        const user = await this.authService.getProfile();
        if (user) {
          const userRef = doc(this.firestore, 'Coiffeurs', user.uid);
          await updateDoc(userRef, {
            tarifs: [...this.tarifs, this.nouveauTarif]
          });
          this.tarifs.push(this.nouveauTarif);
          this.nouveauTarif = '';
          this.presentToast('Tarif ajouté avec succès');
        }
      } catch (error) {
        console.error('Erreur:', error);
        this.presentToast('Erreur lors de l\'ajout du tarif');
      }
    }
  }

  async supprimerTarif(index: number) {
    try {
      const user = await this.authService.getProfile();
      if (user) {
        const nouveauxTarifs = this.tarifs.filter((_, i) => i !== index);
        const userRef = doc(this.firestore, 'Coiffeurs', user.uid);
        await updateDoc(userRef, { tarifs: nouveauxTarifs });
        this.tarifs = nouveauxTarifs;
        this.presentToast('Tarif supprimé avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      this.presentToast('Erreur lors de la suppression du tarif');
    }
  }

  async supprimerPhotoCoupe(index: number, photoUrl: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Suppression...'
    });
    await loading.present();

    try {
      const user = await this.authService.getProfile();
      if (!user) throw new Error('Utilisateur non connecté');

      // Debug logs
      console.log('Original photoUrl:', photoUrl);
      
      // Decode the URL first to handle any URL encoding
      const decodedUrl = decodeURIComponent(photoUrl);
      console.log('Decoded URL:', decodedUrl);
      
      // Extract just the filename without the full path
      const fileName = decodedUrl.split('/').pop()?.split('?')[0];
      console.log('Extracted fileName:', fileName);
      
      // Build the clean storage path
      const storagePath = `hairstyles/${user.uid}/${fileName}`;
      console.log('Final storage path:', storagePath);
      
      // Create storage reference and delete
      const photoRef = ref(this.storage, storagePath);
      await deleteObject(photoRef);

      // Update Firestore
      const userRef = doc(this.firestore, 'Coiffeurs', user.uid);
      this.photosCoupes.splice(index, 1);
      await updateDoc(userRef, {
        photosCoupes: this.photosCoupes
      });

      this.presentToast('Photo supprimée avec succès');
    } catch (error) {
      console.error('Erreur détaillée:', error);
      this.presentToast('Erreur lors de la suppression de la photo');
    } finally {
      loading.dismiss();
    }
  }

  async updateTypes() {
    try {
      const user = await this.authService.getProfile();
      if (user) {
        const userRef = doc(this.firestore, 'Coiffeurs', user.uid);
        await updateDoc(userRef, {
          typeCoiffeur: this.selectedTypes
        });
        this.presentToast('Types de coiffeur mis à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des types:', error);
      this.presentToast('Erreur lors de la mise à jour des types');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
