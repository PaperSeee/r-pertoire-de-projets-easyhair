import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail-barber',
  templateUrl: './detail-barber.page.html',
  styleUrls: ['./detail-barber.page.scss']
})
export class DetailBarberPage implements OnInit {
  barber: any = {};

  constructor(private router: Router, private http: HttpClient) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.barber = navigation.extras.state['data'];
      console.log('Received barber data:', this.barber);
    }
  }

  ngOnInit() {
    if (!this.barber) {
      this.router.navigate(['/']);
    } else {
      this.getBarberDetails();
    }
  }

  getBarberDetails() {
    this.http.get('https://api.example.com/barber/1').subscribe((data: any) => {
      this.barber.profile = data.profile;
      this.barber.image = data.image; // Ensure this line is present to set the image property
    });
  }

  navigateToAgenda() {
    this.router.navigate(['/agenda']);
  }
}
