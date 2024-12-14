import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/authentification.service';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

interface Appointment {
  id: string;
  date: string;
  heure: string;
  nomCoiffeur: string;
  adresse: string;
  tarif: string;
  uidClient: string;
  uidCoiffeur: string;
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
    private router: Router
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
      
      // Créer la requête avec le filtrage par uidClient
      const q = query(
        rdvRef,
        where('uidClient', '==', user.uid),
        // Optionnel: Ajouter un tri par date
        where('date', '>=', new Date().toISOString().split('T')[0]) // Ne prendre que les RDV à venir
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('Aucun rendez-vous trouvé');
        this.appointments = [];
        return;
      }

      // Mapper les documents en objets typés
      this.appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Appointment));

      // Trier les rendez-vous par date et heure
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
      // Optionnel: Afficher un message d'erreur à l'utilisateur
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
}
