import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { AuthentificationService } from 'src/app/authentification.service';

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
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})

export class AgendaPage implements OnInit {
  appointments: Appointment[] = [];
  private firestore = getFirestore();

  constructor(private authService: AuthentificationService) { }

  ngOnInit() {
    this.loadAppointments();
  }

  // Rafraîchir les données quand on revient sur la page
  ionViewWillEnter() {
    this.loadAppointments();
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

      // Créer la date du jour sans l'heure
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayString = today.toISOString().split('T')[0];

      const rdvRef = collection(this.firestore, 'RDV');
      const q = query(rdvRef, 
        where('uidCoiffeur', '==', user.uid),
        where('date', '>=', todayString)
      );
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
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // Reset time parts for accurate date comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return "Aujourd'hui";
    }
    if (date.getTime() === tomorrow.getTime()) {
      return "Demain";
    }

    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric', 
      month: 'long'
    }).charAt(0).toUpperCase() + date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric', 
      month: 'long'
    }).slice(1);
  }

}

