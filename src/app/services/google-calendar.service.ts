import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  constructor() { }

  getAvailableSlots(): Observable<any[]> {
    // Implement your actual logic here
    return of([]);
  }

  getAvailableTimes(date: string): string[] {
    // Implement your actual logic here
    return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  }
}

export default GoogleCalendarService;