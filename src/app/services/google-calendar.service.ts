import { Injectable } from '@angular/core';
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  private firestore = getFirestore();

  constructor() { }

  async isTimeSlotAvailable(uid: string, date: string, heure: string): Promise<boolean> {
    const rdvRef = collection(this.firestore, 'RDV');
    const q = query(rdvRef, 
      where('uidCoiffeur', '==', uid),
      where('date', '==', date),
      where('heure', '==', heure),
      where('statut', '!=', 'canceled')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  }

  getAvailableTimes(date: string): string[] {
    const selectedDate = new Date(date);
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    
    const allTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    
    if (!isToday) {
      return allTimes;
    }

    // Si c'est aujourd'hui, filtrer les heures déjà passées
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    return allTimes.filter(time => {
      const [hours, minutes] = time.split(':').map(Number);
      if (hours > currentHour) {
        return true;
      }
      if (hours === currentHour) {
        return minutes > currentMinutes;
      }
      return false;
    });
  }

  async getAvailableTimesForDate(uid: string, date: string): Promise<string[]> {
    // 1. Récupérer le jour de la semaine
    const selectedDate = new Date(date);
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const dayName = days[selectedDate.getDay()];

    // 2. Récupérer les horaires du coiffeur
    const coiffeurDoc = await getDoc(doc(this.firestore, 'Coiffeurs', uid));
    if (!coiffeurDoc.exists()) return [];

    const schedule = coiffeurDoc.data()?.['schedule'];
    if (!schedule) return [];

    // 3. Vérifier si le jour est activé et récupérer ses horaires
    const daySchedule = schedule[dayName];
    if (!daySchedule?.enabled || !daySchedule?.hours?.length) return [];

    // 4. Filtrer les horaires déjà réservés
    const availableHours = [];
    for (const hour of daySchedule.hours) {
      const isAvailable = await this.isTimeSlotAvailable(uid, date, hour);
      if (isAvailable) {
        availableHours.push(hour);
      }
    }

    // 5. Filtrer les heures passées si c'est aujourd'hui
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    
    if (isToday) {
      return availableHours.filter(time => {
        const [hours, minutes] = time.split(':').map(Number);
        if (hours > now.getHours()) {
          return true;
        }
        if (hours === now.getHours()) {
          return minutes > now.getMinutes();
        }
        return false;
      });
    }

    return availableHours;
  }
}

export default GoogleCalendarService;