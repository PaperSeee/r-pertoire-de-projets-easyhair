import { Component, OnInit } from '@angular/core';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthentificationService } from 'src/app/authentification.service';
import { ToastController } from '@ionic/angular';

interface DaySchedule {
  enabled: boolean;
  hours: string[];
}

@Component({
  selector: 'app-mes-horaires',
  templateUrl: './mes-horaires.page.html',
  styleUrls: ['./mes-horaires.page.scss'],
})
export class MesHorairesPage implements OnInit {
  private firestore = getFirestore();
  
  availableHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  weekSchedule: { [key: string]: DaySchedule } = {
    'Lundi': { enabled: true, hours: [...this.availableHours] },
    'Mardi': { enabled: true, hours: [...this.availableHours] },
    'Mercredi': { enabled: true, hours: [...this.availableHours] },
    'Jeudi': { enabled: true, hours: [...this.availableHours] },
    'Vendredi': { enabled: true, hours: [...this.availableHours] },
    'Samedi': { enabled: true, hours: [...this.availableHours] },
    'Dimanche': { enabled: false, hours: [] }
  };

  constructor(
    private authService: AuthentificationService,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.loadSchedule();
  }

  async loadSchedule() {
    try {
      const user = await this.authService.getProfile();
      if (!user) return;

      const docRef = doc(this.firestore, 'Coiffeurs', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data()?.['schedule']) {
        this.weekSchedule = docSnap.data()?.['schedule'];
      }
    } catch (error) {
      console.error('Erreur lors du chargement des horaires:', error);
    }
  }

  async saveSchedule() {
    try {
      const user = await this.authService.getProfile();
      if (!user) return;

      const docRef = doc(this.firestore, 'Coiffeurs', user.uid);
      await updateDoc(docRef, {
        schedule: this.weekSchedule
      });

      const toast = await this.toastCtrl.create({
        message: 'Horaires sauvegardés avec succès',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des horaires:', error);
    }
  }
}
