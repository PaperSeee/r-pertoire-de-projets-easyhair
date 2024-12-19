import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import GoogleCalendarService from '../../../services/google-calendar.service';
import { Router } from '@angular/router';
import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { AuthentificationService } from 'src/app/authentification.service';

interface Appointment {
  uidCoiffeur: string;
  uidClient: string;
  nomCoiffeur: string;
  tarif: string; 
  adresse: string;
  date: string;
  heure: string;
  statut: string; // New field
}

@Component({
  selector: 'app-prendre-rdv',
  templateUrl: './prendre-rdv.page.html',
  styleUrls: ['./prendre-rdv.page.scss'],
  providers: [GoogleCalendarService]  // Add service to component providers
})

export class PrendreRdvPage implements OnInit {
  coiffeur: any;
  bookingForm: FormGroup;
  availableTimes: string[] = [];
  selectedSlot: any = null;
  minDate = new Date().toISOString();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString();
  userAddress: string = '';
  private firestore = getFirestore();
  // Ajouter cette propriété
  availableDates: string[] = [];
  // Ajouter ces propriétés
  private cachedDates: {[key: string]: boolean} = {};
  public isLoading = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private googleCalendarService: GoogleCalendarService,
    private alertController: AlertController,
    private authService: AuthentificationService // Ajoutez le service d'authentification
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.coiffeur = navigation.extras.state['coiffeur'];
    }
    
    this.bookingForm = this.formBuilder.group({
      selectedService: ['', Validators.required], // Ajout du contrôle pour le service
      selectedDate: ['', Validators.required],
      selectedTime: ['', Validators.required],
      statut: ['active'] // Add with default value
    });
   }

  async ngOnInit() {
    await this.loadUserAddress();
    // Ajouter le chargement des dates disponibles
    await this.loadAvailableDates();
  }

  async onDateSelected(event: any) {
    if (this.bookingForm.get('selectedTime')?.value) {
      this.bookingForm.patchValue({ selectedTime: '' });
    }
    const selectedDate = event.detail.value;
    const dateOnly = selectedDate.split('T')[0];
    
    // Récupérer uniquement les créneaux disponibles
    this.availableTimes = await this.googleCalendarService.getAvailableTimesForDate(
      this.coiffeur.uid,
      dateOnly
    );
      
    // Si aucun horaire n'est disponible
    if (this.availableTimes.length === 0) {
      this.alertController.create({
        header: 'Information',
        message: 'Aucun horaire n\'est disponible pour cette date. Veuillez sélectionner une autre date.',
        buttons: ['OK']
      }).then(alert => alert.present());
    }
  }

  async confirmBooking() {
    if (this.bookingForm.valid) {
      try {
        const currentUser = await this.authService.getProfile();
        if (!currentUser) throw new Error('Utilisateur non connecté');

        const fullDate = this.bookingForm.get('selectedDate').value;
        const dateOnly = fullDate.split('T')[0];
        const selectedTime = this.bookingForm.get('selectedTime').value;

        // Vérifier si le créneau est disponible
        const isAvailable = await this.googleCalendarService.isTimeSlotAvailable(
          this.coiffeur.uid,
          dateOnly,
          selectedTime
        );

        if (!isAvailable) {
          const alert = await this.alertController.create({
            header: 'Créneau non disponible',
            message: 'Le créneau sélectionné n\'est plus disponible. Veuillez en choisir un autre.',
            buttons: ['OK']
          });
          await alert.present();
          return;
        }

        const appointment: Appointment = {
          uidCoiffeur: this.coiffeur.uid,
          uidClient: currentUser.uid,
          nomCoiffeur: this.coiffeur.nomCoiffeur,
          tarif: this.bookingForm.get('selectedService').value,
          adresse: this.userAddress,
          date: dateOnly, // Using only the date part
          heure: selectedTime,
          statut: 'active' // Include status
        };

        const rdvRef = collection(this.firestore, 'RDV');
        await addDoc(rdvRef, appointment);

        // Afficher confirmation
        const alert = await this.alertController.create({
          header: 'Succès',
          message: 'Votre rendez-vous a été confirmé',
          buttons: ['OK']
        });
        await alert.present();

        // Rediriger vers la page d'accueil
        this.router.navigate(['/tabs/accueil']);

      } catch (error) {
        console.error('Erreur lors de la réservation:', error);
        const alert = await this.alertController.create({
          header: 'Erreur',
          message: 'Une erreur est survenue lors de la réservation',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }

  async loadUserAddress() {
    try {
      const user = await this.authService.getProfile();
      if (user) {
        const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData?.['adresse']) {
            this.userAddress = `${userData['adresse'].rue}, ${userData['adresse'].commune}`;
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'adresse:', error);
    }
  }

  // Modifier loadAvailableDates pour charger seulement le mois en cours
  async loadAvailableDates() {
    const dates: string[] = [];
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + 56); // Charger 4 semaines (28 jours) initialement

    await this.checkDatesRange(start, end);
  }

  // Nouvelle méthode pour vérifier une plage de dates
  private async checkDatesRange(start: Date, end: Date) {
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      if (this.cachedDates[dateStr] === undefined) {
        // Vérifier seulement les dates non cachées
        const isAvailable = await this.googleCalendarService.isDateAvailable(this.coiffeur.uid, dateStr);
        this.cachedDates[dateStr] = isAvailable;
        if (isAvailable) {
          this.availableDates.push(dateStr);
        }
      }
    }
  }

  
// Modifier la méthode isDateEnabled pour être plus performante
isDateEnabled = (dateString: string): boolean => {
  const dateStr = dateString.split('T')[0];
  return this.cachedDates[dateStr] !== false;
}

  // Nouvelle méthode pour charger une date si nécessaire
  private async loadDateIfNeeded(dateStr: string) {
    if (!this.isLoading) {
      this.isLoading = true;
      const date = new Date(dateStr);
      const endOfWeek = new Date(date);
      endOfWeek.setDate(date.getDate() + 7);
      
      await this.checkDatesRange(date, endOfWeek);
      this.isLoading = false;
    }
  }

  async loadMonthDates(date: Date) {
    this.isLoading = true;
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    await this.checkDatesRange(start, end);
    this.isLoading = false;
  }

  async onMonthChange(event: any) {
    const selectedDate = new Date(event.detail.value);
    await this.loadMonthDates(selectedDate);
  }

}
