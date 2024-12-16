import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { AuthentificationService } from 'src/app/authentification.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

interface Appointment {
  id: string;
  uidClient: string;
  tarif: string;
  date: string;
  heure: string;
  adresse: string;
  statut: string;
  nomCompletClient?: string; // Ajout du nom complet du client
}

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
  appointments: Appointment[] = [];

  constructor(
    public authService: AuthentificationService, 
    public router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.loadUserCommunes();
    this.loadAppointments();
  }

  // Rafraîchir les données quand on revient sur la page
  ionViewWillEnter() {
    this.loadAppointments();
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

  private async getClientName(uid: string): Promise<string> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return `${userData['prénom']} ${userData['nom']}`;
      }
      return 'Client inconnu';
    } catch (error) {
      console.error('Erreur lors de la récupération du nom du client:', error);
      return 'Client inconnu';
    }
  }

  async loadAppointments() {
    try {
      const user = await this.authService.getProfile();
      if (!user) {
        console.warn('Aucun coiffeur connecté');
        return;
      }

      const rdvRef = collection(this.firestore, 'RDV');
      const q = query(rdvRef, where('uidCoiffeur', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('Aucun rendez-vous trouvé');
        this.appointments = [];
        return;
      }

      // Récupérer les rendez-vous et les noms des clients
      const appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Appointment));

      // Ajouter le nom complet pour chaque rendez-vous
      for (const rdv of appointments) {
        rdv.nomCompletClient = await this.getClientName(rdv.uidClient);
      }

      this.appointments = appointments;

      // Tri par date et heure
      this.appointments.sort((a, b) => {
        const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateComparison === 0) {
          return a.heure.localeCompare(b.heure);
        }
        return dateComparison;
      });

    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
      this.appointments = [];
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString('fr-FR', {
      weekday: 'long', 
      day: 'numeric',
      month: 'long'
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }



}
