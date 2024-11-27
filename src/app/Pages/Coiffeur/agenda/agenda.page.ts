import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import GoogleCalendarService from '../../../services/google-calendar.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
  providers: [GoogleCalendarService]  // Add service to component providers
})
export class AgendaPage implements OnInit {
  bookingForm: FormGroup;
  availableSlots: any[] = [];
  availableTimes: string[] = [];
  selectedSlot: any = null;
  minDate = new Date().toISOString();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString();

  constructor(
    private fb: FormBuilder,
    private googleCalendarService: GoogleCalendarService,
    private alertController: AlertController
  ) {
    this.bookingForm = this.fb.group({
      selectedDate: ['', Validators.required],
      selectedTime: ['', Validators.required]
    });
  }

  ngOnInit() {
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
            handler: () => {
              console.log('Booking confirmed:', this.bookingForm.value);
              // Implement your booking logic here
            }
          }
        ]
      });

      await alert.present();
    }
  }
}