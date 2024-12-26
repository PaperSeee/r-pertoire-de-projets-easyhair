import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

interface Coiffeur {
  id: string;
  nomCoiffeur: string;
  typeCoiffeur: string[];
  tarifs: string[];
  photoURL?: string;
  photosCoupes?: string[];
  averageRating?: number;
}

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
})
export class AccueilPage implements OnInit {
  coiffeurs: any[] = [];
  filteredCoiffeurs: any[] = [];
  activeFilter: string | null = null;
  sortByPriceAsc: boolean = true;
  private firebaseApp = initializeApp(environment.firebaseConfig);
  private firestore = getFirestore(this.firebaseApp);
  isSearchbarOpen: boolean = false;
  searchTerm: string = '';

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
      this.coiffeurs = await Promise.all(querySnapshot.docs.map(async doc => {
        const coiffeur = {
          id: doc.id,
          ...doc.data()
        } as Coiffeur;

        // Récupérer les avis pour ce coiffeur
        const reviewsRef = collection(this.firestore, 'Avis');
        const q = query(reviewsRef, where('uidCoiffeur', '==', coiffeur.id));
        const reviewsSnapshot = await getDocs(q);
        
        // Calculer la moyenne
        if (!reviewsSnapshot.empty) {
          const sum = reviewsSnapshot.docs.reduce((acc, doc) => acc + doc.data()['note'], 0);
          coiffeur.averageRating = Number((sum / reviewsSnapshot.docs.length).toFixed(1));
        }

        return coiffeur;
      }));
      this.filteredCoiffeurs = [...this.coiffeurs];
    } catch (error) {
      console.error('Erreur lors du chargement des coiffeurs:', error);
    }
  }

  filterByType(type: string) {
    if (this.activeFilter === type) {
      this.activeFilter = null;
      this.filteredCoiffeurs = [...this.coiffeurs];
    } else {
      this.activeFilter = type;
      this.filteredCoiffeurs = this.coiffeurs.filter(coiffeur => 
        coiffeur.typeCoiffeur?.includes(type)
      );
    }
  }

  toggleSortByPrice() {
    this.sortByPriceAsc = !this.sortByPriceAsc;
    this.filteredCoiffeurs.sort((a, b) => {
      const prixA = parseFloat(this.getPrix(a.tarifs?.[0] || '0').replace('€', ''));
      const prixB = parseFloat(this.getPrix(b.tarifs?.[0] || '0').replace('€', ''));
      return this.sortByPriceAsc ? prixA - prixB : prixB - prixA;
    });
  }

  // Helper pour extraire le prix des tarifs
  getPrix(tarif: string): string {
    const match = tarif.match(/\((.*?)\)/);
    return match ? match[1] : '';
  }
}
