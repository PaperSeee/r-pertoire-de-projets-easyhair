import { Component, OnInit, OnDestroy } from '@angular/core';
import { getFirestore, collection, query, where, getDocs, getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { AuthentificationService } from 'src/app/authentification.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

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
export class DashboardPage implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  private firestore = getFirestore();
  stats = {
    total: 0,
    finished: 0,
    canceled: 0
  };
  private pieChart: Chart | null = null;

  constructor(private authService: AuthentificationService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  // Rafraîchir les données quand on revient sur la page
  ionViewWillEnter() {
    this.loadAppointments();
  }

  ngOnDestroy() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
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
      this.calculateStats(); // Add this line after appointments are loaded

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

  private calculateStats() {
    this.stats.total = this.appointments.length;
    this.stats.finished = this.appointments.filter(rdv => rdv.statut === 'finished').length;
    this.stats.canceled = this.appointments.filter(rdv => rdv.statut === 'canceled').length;
    this.createCharts();
  }

  private createCharts() {
    const pieCtx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (pieCtx) {
      // Détruire l'ancien graphique s'il existe
      if (this.pieChart) {
        this.pieChart.destroy();
      }

      // Créer le nouveau graphique
      this.pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['En cours', 'Terminés', 'Annulés'],
          datasets: [{
            data: [
              this.stats.total - (this.stats.finished + this.stats.canceled),
              this.stats.finished,
              this.stats.canceled
            ],
            backgroundColor: ['#343434', '#8C8C8C', '#D9D9D9']
          }]
        }
      });
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
