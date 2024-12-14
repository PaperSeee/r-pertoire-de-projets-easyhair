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
  }

  onDateSelected(event: any) {
    if (this.bookingForm.get('selectedTime')?.value) {
      this.bookingForm.patchValue({ selectedTime: '' });
    }
    const selectedDate = event.detail.value;
    this.availableTimes = this.googleCalendarService.getAvailableTimes(selectedDate);
    
    // Si aucun horaire n'est disponible
    if (this.availableTimes.length === 0) {
      this.alertController.create({
        header: 'Information',
        message: 'Aucun horaire n\'est disponible pour aujourd\'hui. Veuillez sélectionner une autre date.',
        buttons: ['OK']
      }).then(alert => alert.present());
    }
  }

  async confirmBooking() {
    if (this.bookingForm.valid) {
      try {
        const currentUser = await this.authService.getProfile();
        if (!currentUser) throw new Error('Utilisateur non connecté');

        // Get the date value and format it
        const fullDate = this.bookingForm.get('selectedDate').value;
        const dateOnly = fullDate.split('T')[0]; // This will get only '2024-12-16'
        
        const appointment: Appointment = {
          uidCoiffeur: this.coiffeur.uid,
          uidClient: currentUser.uid,
          nomCoiffeur: this.coiffeur.nomCoiffeur,
          tarif: this.bookingForm.get('selectedService').value,
          adresse: this.userAddress,
          date: dateOnly, // Using only the date part
          heure: this.bookingForm.get('selectedTime').value,
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

}
