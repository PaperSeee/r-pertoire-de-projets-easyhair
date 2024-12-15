import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
})
export class AccueilPage implements OnInit {
  coiffeurs: any[] = [];
  private firebaseApp = initializeApp(environment.firebaseConfig);
  private firestore = getFirestore(this.firebaseApp);
  isSearchbarOpen: boolean = false;
  searchTerm: string = '';
  filteredCoiffeurs: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadCoiffeurs();
  }

  toggleSearchbar() {
    this.isSearchbarOpen = !this.isSearchbarOpen;
    if (!this.isSearchbarOpen) {
      this.searchTerm = '';
      this.filteredCoiffeurs = [...this.coiffeurs];
    }
  }

  handleSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filteredCoiffeurs = this.coiffeurs.filter(coiffeur => 
      coiffeur.nomCoiffeur.toLowerCase().includes(this.searchTerm)
    );
  }

  async loadCoiffeurs() {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'Coiffeurs'));
      this.coiffeurs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      this.filteredCoiffeurs = [...this.coiffeurs];
    } catch (error) {
      console.error('Erreur lors du chargement des coiffeurs:', error);
    }
  }

  // Helper pour extraire le prix des tarifs
  getPrix(tarif: string): string {
    const match = tarif.match(/\((.*?)\)/);
    return match ? match[1] : '';
  }
}
