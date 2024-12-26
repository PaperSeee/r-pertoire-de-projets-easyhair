import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/authentification.service';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';

interface Appointment {
  id: string;
  date: string;
  heure: string;
  nomCoiffeur: string;
  adresse: string;
  tarif: string;
  uidClient: string;
  uidCoiffeur: string;
  statut?: string;
  showReviewForm?: boolean;
  rating?: number;
  comment?: string;
}

interface Review {
  uidClient: string;
  uidCoiffeur: string;
  note: number;
  commentaire: string;
  date: string;
  reponse: string;
}

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  user: any;
  appointments: Appointment[] = [];
  private firestore = getFirestore();

  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadAppointments(); // Load appointments on init
  }

  // Add ionViewWillEnter to refresh data when entering page
  ionViewWillEnter() {
    this.loadAppointments();
  }

  async loadProfile() {
    try {
      this.user = await this.authService.getProfile();
      console.log('Profil chargé:', this.user);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  }

  async logout() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/connexion']);
    }).catch((error) => {
      console.log(error);
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  async loadAppointments() {
    try {
      const user = await this.authService.getProfile();
      if (!user) {
        console.warn('Aucun utilisateur connecté');
        return;
      }

      const rdvRef = collection(this.firestore, 'RDV');
      
      // Requête simplifiée sans filtre de date
      const q = query(
        rdvRef,
        where('uidClient', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('Aucun rendez-vous trouvé');
        this.appointments = [];
        return;
      }

      this.appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Appointment));

      // Tri par date et heure
      this.appointments.sort((a, b) => {
        const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateComparison === 0) {
          return a.heure.localeCompare(b.heure);
        }
        return dateComparison;
      });

      console.log('Rendez-vous chargés:', this.appointments);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
      this.appointments = [];
    }
  }

  // Dans profil.page.ts, ajoutez cette fonction
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // Dans profil.page.ts, ajouter cette fonction
  goToBarberDetail(uidCoiffeur: string) {
    this.router.navigate(['/detail-barber', uidCoiffeur]);
  }

  // Vérifier si le rendez-vous est passé
  isAppointmentPassed(rdv: Appointment): boolean {
    const today = new Date();
    const rdvDate = new Date(rdv.date);
    const rdvTime = rdv.heure.split(':');
    rdvDate.setHours(parseInt(rdvTime[0]), parseInt(rdvTime[1]));
    
    return rdvDate < today;
  }

  // Marquer comme terminé
  async markAsFinished(rdv: Appointment) {
    try {
      // Mise à jour du statut dans Firestore avec la bonne collection et le bon champ
      const rdvDoc = doc(this.firestore, 'RDV', rdv.id);
      await updateDoc(rdvDoc, {
        statut: 'finished'
      });

      // Message de confirmation
      const toast = await this.toastController.create({
        message: 'Rendez-vous marqué comme terminé',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();

      // Rafraîchir la liste des rendez-vous
      this.loadAppointments();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      const toast = await this.toastController.create({
        message: 'Erreur lors de la mise à jour',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
    }
  }

  // Vérifier si l'annulation est possible (24h avant)
  canCancelAppointment(rdv: Appointment): boolean {
    const now = new Date();
    const rdvDate = new Date(rdv.date);
    const rdvTime = rdv.heure.split(':');
    rdvDate.setHours(parseInt(rdvTime[0]), parseInt(rdvTime[1]));
    
    const diffHours = (rdvDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 24;
  }

  async cancelAppointment(rdv: Appointment, popover: any) {
    try {
      const rdvDoc = doc(this.firestore, 'RDV', rdv.id);
      await updateDoc(rdvDoc, {
        statut: 'canceled'
      });

      // Ferme le popover
      await popover.dismiss();

      const toast = await this.toastController.create({
        message: 'Rendez-vous annulé avec succès',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();

      this.loadAppointments();
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      const toast = await this.toastController.create({
        message: 'Erreur lors de l\'annulation du rendez-vous',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
    }
  }

  getActiveAppointments(): Appointment[] {
    return this.appointments.filter(rdv => 
      rdv.statut !== 'finished' && rdv.statut !== 'canceled'
    );
  }

  async submitReview(rdv: Appointment) {
    try {
      if (!rdv.rating || !rdv.comment) {
        const toast = await this.toastController.create({
          message: 'Veuillez donner une note et un commentaire',
          duration: 2000,
          position: 'bottom',
          color: 'warning'
        });
        toast.present();
        return;
      }

      const review: Review = {
        uidClient: rdv.uidClient,
        uidCoiffeur: rdv.uidCoiffeur,
        note: rdv.rating,
        commentaire: rdv.comment,
        date: new Date().toISOString(),
        reponse: ''
      };

      // Add to Firestore
      await addDoc(collection(this.firestore, 'Avis'), review);

      // Show success message
      const toast = await this.toastController.create({
        message: 'Votre avis a été enregistré',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();

      // Reset form
      rdv.showReviewForm = false;
      rdv.rating = undefined;
      rdv.comment = '';

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'avis:', error);
      const toast = await this.toastController.create({
        message: 'Erreur lors de l\'enregistrement de l\'avis',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
    }
  }
}
