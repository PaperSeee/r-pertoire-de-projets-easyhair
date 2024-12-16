import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, query, where, getDocs, getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
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
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  appointments: Appointment[] = [];
  private firestore = getFirestore();

  constructor(private authService: AuthentificationService) {}

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

  async deleteAppointment(appointmentId: string) {
    try {
      await deleteDoc(doc(this.firestore, 'RDV', appointmentId));
      // Remove the appointment from the local array
      this.appointments = this.appointments.filter(rdv => rdv.id !== appointmentId);
    } catch (error) {
      console.error('Erreur lors de la suppression du rendez-vous:', error);
    }
  }

  isAppointmentPast(date: string, heure: string): boolean {
    const [hours, minutes] = heure.split(':');
    const appointmentDate = new Date(date);
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0);
    const now = new Date();
    return appointmentDate < now;
  }

  // Optional: Add this method for debugging specific appointments
  debugAppointment(date: string, heure: string): void {
    const [hours, minutes] = heure.split(':');
    const appointmentDate = new Date(date);
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0);
    const now = new Date();
    
    console.log('Appointment formatted:', appointmentDate);
    console.log('Now:', now);
    console.log('Is past:', appointmentDate < now);
  }

  async markAsFinished(appointmentId: string) {
    try {
      const appointmentRef = doc(this.firestore, 'RDV', appointmentId);
      await updateDoc(appointmentRef, {
        statut: 'finished'
      });
      // Update local array
      const index = this.appointments.findIndex(rdv => rdv.id === appointmentId);
      if (index !== -1) {
        this.appointments[index].statut = 'finished';
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', error);
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
