import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  constructor() { }

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
}

export default GoogleCalendarService;