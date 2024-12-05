import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
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

  // Ajouter ionViewWillEnter pour recharger les données quand on revient sur la page
  async ionViewWillEnter() {
    await this.loadProfileData();
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

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
