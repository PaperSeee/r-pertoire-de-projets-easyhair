import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import GoogleCalendarService from '../../../services/google-calendar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prendre-rdv',
  templateUrl: './prendre-rdv.page.html',
  styleUrls: ['./prendre-rdv.page.scss'],
  providers: [GoogleCalendarService]  // Add service to component providers
})

export class PrendreRdvPage implements OnInit {
  coiffeur: any;
  bookingForm: FormGroup;
  availableSlots: any[] = [];
  availableTimes: string[] = [];
  selectedSlot: any = null;
  minDate = new Date().toISOString();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private googleCalendarService: GoogleCalendarService,
    private alertController: AlertController,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.coiffeur = navigation.extras.state['coiffeur'];
    }
    
    this.bookingForm = this.formBuilder.group({
      selectedService: ['', Validators.required], // Ajout du contrôle pour le service
      selectedDate: ['', Validators.required],
      selectedTime: ['', Validators.required]
    });
   }

  async ngOnInit() {
    this.loadAvailableSlots();
  }

  loadAvailableSlots() {
    this.googleCalendarService.getAvailableSlots().subscribe(slots => {
      this.availableSlots = slots;
    });
  }

  selectSlot(slot: any) {
    this.selectedSlot = slot;
  }

  onDateSelected(event: any) {
    const selectedDate = event.detail.value;
    this.availableTimes = this.googleCalendarService.getAvailableTimes(selectedDate);
  }

  async confirmBooking() {
    if (this.bookingForm.valid) {
      const date = new Date(this.bookingForm.value.selectedDate);
      const formattedDate = date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const alert = await this.alertController.create({
        header: 'Confirmation de réservation',
        message: `Voulez-vous confirmer votre rendez-vous pour le ${formattedDate} à ${this.bookingForm.value.selectedTime} avec votre coiffeur ?`,
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel'
          },
          {
            text: 'Confirmer',
            handler: async () => {
              console.log('Booking confirmed:', this.bookingForm.value);
              const confirmationAlert = await this.alertController.create({
                header: 'Réservation Confirmée',
                message: 'Votre rendez-vous est bien confirmé',
                buttons: ['OK']
              });

              await confirmationAlert.present();
              confirmationAlert.onDidDismiss().then(() => {
                this.router.navigate(['/tabs/profil']);
              });
            }
          }
        ]
      });

      await alert.present();
    }
  }

}
