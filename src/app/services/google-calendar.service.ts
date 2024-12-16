import { Injectable } from '@angular/core';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  private firestore = getFirestore();

  constructor() { }

  async isTimeSlotAvailable(coiffeurId: string, date: string, heure: string): Promise<boolean> {
    const rdvRef = collection(this.firestore, 'RDV');
    const q = query(rdvRef, 
      where('uidCoiffeur', '==', coiffeurId),
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

  async getAvailableTimesForDate(coiffeurId: string, date: string): Promise<string[]> {
    const allTimes = this.getAvailableTimes(date);
    const availableTimes = [];

    for (const time of allTimes) {
      const isAvailable = await this.isTimeSlotAvailable(coiffeurId, date, time);
      if (isAvailable) {
        availableTimes.push(time);
      }
    }

    return availableTimes;
  }
}

export default GoogleCalendarService;