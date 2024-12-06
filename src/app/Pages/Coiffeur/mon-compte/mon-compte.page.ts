import { Component, OnInit } from '@angular/core';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthentificationService } from 'src/app/authentification.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mon-compte',
  templateUrl: './mon-compte.page.html',
  styleUrls: ['./mon-compte.page.scss'],
})
export class MonComptePage implements OnInit {
  communes = [
    "Anderlecht (1070)", "Auderghem (1160)", "Berchem-Sainte-Agathe (1082)",
    "Bruxelles (1000)", "Etterbeek (1040)", "Evere (1140)", 
    "Forest (1190)", "Ganshoren (1083)", "Ixelles (1050)",
    "Jette (1090)", "Koekelberg (1081)", "Molenbeek-Saint-Jean (1080)",
    "Saint-Gilles (1060)", "Saint-Josse-ten-Noode (1210)", 
    "Schaerbeek (1030)", "Uccle (1180)", "Watermael-Boitsfort (1170)",
    "Woluwe-Saint-Lambert (1200)", "Woluwe-Saint-Pierre (1150)"
  ];
  selectedCommunes: string[] = [];
  private firestore = getFirestore();

  constructor(
    public authService: AuthentificationService, 
    public router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadUserCommunes();
  }

  async logout() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/connexion']);
    }).catch((error) => {
      console.log(error);
    });
  }

  async loadUserCommunes() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      const user = await this.authService.getProfile();
      if (user) {
        const userDoc = await getDoc(doc(this.firestore, 'Coiffeurs', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.selectedCommunes = userData['communes'] || [];
        }
      }
    } catch (error) {
      console.error('Error loading communes:', error);
      this.presentToast('Erreur lors du chargement des communes');
    } finally {
      loading.dismiss();
    }
  }

  async updateCommunes() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      const user = await this.authService.getProfile();
      if (user) {
        const userRef = doc(this.firestore, 'Coiffeurs', user.uid);
        await updateDoc(userRef, { communes: this.selectedCommunes });
        this.presentToast('Communes mises à jour avec succès');
      }
    } catch (error) {
      console.error('Error updating communes:', error);
      this.presentToast('Erreur lors de la mise à jour des communes');
    } finally {
      loading.dismiss();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
