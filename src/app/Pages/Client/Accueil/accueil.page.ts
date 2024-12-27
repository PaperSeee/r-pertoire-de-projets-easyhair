import { Component, OnInit, OnDestroy } from '@angular/core';
// Add IonicModule imports
import { ViewWillEnter } from '@ionic/angular';
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { AuthentificationService } from 'src/app/authentification.service';
import { getAuth, Unsubscribe } from 'firebase/auth';

interface Coiffeur {
  id: string;
  nomCoiffeur: string;
  typeCoiffeur: string[];
  tarifs: string[];
  photoURL?: string;
  photosCoupes?: string[];
  averageRating?: number;
  communes?: string[];
}

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
})
export class AccueilPage implements OnInit, OnDestroy, ViewWillEnter {
  coiffeurs: Coiffeur[] = [];
  filteredCoiffeurs: Coiffeur[] = [];
  suggestedCoiffeurs: Coiffeur[] = [];
  activeFilter: string | null = null;
  sortByPriceAsc: boolean = true;
  private firestore = getFirestore();
  isSearchbarOpen: boolean = false;
  searchTerm: string = '';
  userCommune: string | null = null;
  isLoggedIn: boolean = false;
  hasAddress: boolean = false;
  private authStateSubscription: Unsubscribe;

  constructor(private authService: AuthentificationService) {
    const auth = getAuth();
    this.authStateSubscription = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state in component:', user?.uid);
      if (user) {
        await this.checkUserStatus();
      } else {
        // Reset user state when not logged in
        this.isLoggedIn = false;
        this.hasAddress = false;
        this.userCommune = null;
      }
      await this.loadCoiffeurs();
    });
  }

  ngOnDestroy() {
    if (this.authStateSubscription) {
      this.authStateSubscription();
    }
  }

  async ngOnInit() {
    console.log('Start ngOnInit');
  }

  // Add ionViewWillEnter lifecycle hook
  async ionViewWillEnter() {
    console.log('Page will enter');
    await this.checkUserStatus();
    await this.loadCoiffeurs();
  }

  async checkUserStatus() {
    try {
      const user = await this.authService.getProfile();
      
      if (!user) {
        console.log('No authenticated user');
        return;
      }

      this.isLoggedIn = true;
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData?.['adresse']?.commune) {
          this.userCommune = userData['adresse'].commune;
          this.hasAddress = true;
          console.log('User data loaded:', {
            commune: this.userCommune,
            hasAddress: this.hasAddress
          });
        }
      }
    } catch (error) {
      console.error('Error in checkUserStatus:', error);
    }
  }

  toggleSearchbar() {
    this.isSearchbarOpen = !this.isSearchbarOpen;
    if (!this.isSearchbarOpen) {
      this.searchTerm = '';
      this.filteredCoiffeurs = [...this.coiffeurs];
    }
  }

  async loadCoiffeurs() {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, 'Coiffeurs'));
      this.coiffeurs = await Promise.all(querySnapshot.docs.map(async doc => {
        const coiffeur = {
          id: doc.id,
          ...doc.data()
        } as Coiffeur;

        const reviewsRef = collection(this.firestore, 'Avis');
        const q = query(reviewsRef, where('uidCoiffeur', '==', coiffeur.id));
        const reviewsSnapshot = await getDocs(q);
        
        if (!reviewsSnapshot.empty) {
          const sum = reviewsSnapshot.docs.reduce((acc, doc) => acc + doc.data()['note'], 0);
          coiffeur.averageRating = Number((sum / reviewsSnapshot.docs.length).toFixed(1));
        }

        return coiffeur;
      }));

      // If not logged in, show all coiffeurs
      if (!this.isLoggedIn) {
        this.filteredCoiffeurs = [...this.coiffeurs];
        this.suggestedCoiffeurs = [];
        return;
      }

      // Update filtered lists based on user status
      this.updateCoiffeursList();
    } catch (error) {
      console.error('Erreur lors du chargement des coiffeurs:', error);
    }
  }

  private updateCoiffeursList() {
    // Reset lists
    this.filteredCoiffeurs = [];
    this.suggestedCoiffeurs = [];

    console.log('Status:', {
        isLoggedIn: this.isLoggedIn,
        hasAddress: this.hasAddress,
        userCommune: this.userCommune
    });

    if (!this.isLoggedIn) {
        // Not logged in - show all coiffeurs
        this.filteredCoiffeurs = [...this.coiffeurs];
        return;
    }

    if (!this.hasAddress) {
        // Logged in but no address - show only suggestions
        this.suggestedCoiffeurs = this.coiffeurs.slice(0, 5);
        return;
    }

    // Logged in with address
    if (this.userCommune) {
        // Filter coiffeurs by user's commune
        this.filteredCoiffeurs = this.coiffeurs.filter(coiffeur => 
            coiffeur.communes && coiffeur.communes.includes(this.userCommune!)
        );
        
        // Get suggestions from other communes
        const otherCoiffeurs = this.coiffeurs.filter(coiffeur => 
            !coiffeur.communes || !coiffeur.communes.includes(this.userCommune!)
        );
        this.suggestedCoiffeurs = otherCoiffeurs.slice(0, 3);
    }

    console.log('Results:', {
        filtered: this.filteredCoiffeurs.length,
        suggested: this.suggestedCoiffeurs.length
    });
}

  handleSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    if (this.searchTerm) {
        const searchResults = this.coiffeurs.filter(coiffeur => 
            coiffeur.nomCoiffeur.toLowerCase().includes(this.searchTerm)
        );
        
        if (this.isLoggedIn && this.hasAddress) {
            // Maintenir la séparation commune/suggestions pendant la recherche
            this.filteredCoiffeurs = searchResults.filter(c => 
                c.communes?.includes(this.userCommune)
            );
            this.suggestedCoiffeurs = searchResults
                .filter(c => !c.communes?.includes(this.userCommune))
                .slice(0, 3);
        } else {
            this.filteredCoiffeurs = searchResults;
        }
    } else {
        this.updateCoiffeursList();
    }
  }

  filterByType(type: string) {
    if (this.activeFilter === type) {
        this.activeFilter = null;
        this.updateCoiffeursList();
    } else {
        this.activeFilter = type;
        const filtered = this.coiffeurs.filter(coiffeur => 
            coiffeur.typeCoiffeur?.includes(type)
        );
        
        if (this.isLoggedIn && this.hasAddress) {
            this.filteredCoiffeurs = filtered.filter(c => 
                c.communes?.includes(this.userCommune)
            );
            this.suggestedCoiffeurs = filtered
                .filter(c => !c.communes?.includes(this.userCommune))
                .slice(0, 3);
        } else {
            this.filteredCoiffeurs = filtered;
        }
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

  // Add this helper method to the class
  getCommuneWithoutPostalCode(commune: string | null): string {
    if (!commune) return '';
    return commune.split(' (')[0];
  }
}
