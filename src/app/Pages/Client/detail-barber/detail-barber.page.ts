import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../../services/favorites.service';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/authentification.service';

interface User {
  uid: string;
  email: string;
  adresse?: {
    rue?: string;
    commune?: string;
  };
}

// Ajouter l'interface Review en haut du fichier
interface Review {
  id?: string;
  uidClient: string;
  uidCoiffeur: string;
  note: number;
  commentaire: string;
  date: string;
  reponse: string;
  userData?: {
    prenom: string;
    nom: string;
  };
}

@Component({
  selector: 'app-detail-barber',
  templateUrl: './detail-barber.page.html',
  styleUrls: ['./detail-barber.page.scss']
})
export class DetailBarberPage implements OnInit, OnDestroy {
  barber: any = {};
  isFavorite = false;
  private firestore = getFirestore();
  private favoriteStatusSubscription?: Subscription;

  // Ajouter la propriété reviews
  reviews: Review[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private favoritesService: FavoritesService,
    private toastCtrl: ToastController,
    private authService: AuthentificationService
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const barberId = params.get('id');
      if (barberId) {
        await this.loadBarberData(barberId);
      }
    });
  }

  ngOnDestroy() {
    if (this.favoriteStatusSubscription) {
      this.favoriteStatusSubscription.unsubscribe();
    }
  }

  // Modifier loadBarberData pour charger aussi les avis
  private async loadBarberData(barberId: string) {
    try {
      const barberDoc = await getDoc(doc(this.firestore, 'Coiffeurs', barberId));
      if (barberDoc.exists()) {
        this.barber = {
          id: barberDoc.id,
          ...barberDoc.data()
        };
        this.subscribeToFavoriteStatus();
        await this.loadReviews(barberId); // Ajouter cette ligne
      }
    } catch (error) {
      console.error('Erreur lors du chargement du barbier:', error);
      this.router.navigate(['/']);
    }
  }

  private subscribeToFavoriteStatus() {
    if (this.favoriteStatusSubscription) {
      this.favoriteStatusSubscription.unsubscribe();
    }
    this.favoriteStatusSubscription = this.favoritesService
      .getFavoriteStatus(this.barber.id)
      .subscribe(status => {
        this.isFavorite = status;
      });
  }

  toggleFavorite() {
    if (this.isFavorite) {
      this.favoritesService.removeFromFavorites(this.barber.id);
    } else {
      this.favoritesService.addToFavorites(this.barber);
    }
  }

  async onBookingClick() {
    if (await this.authService.isAuthenticated()) {
      this.router.navigate(['/prendre-rdv'], {
        state: { coiffeur: this.barber }
      });
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Veuillez vous connecter ou créer un compte pour prendre rendez-vous.',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  // Ajouter la fonction loadReviews
  async loadReviews(barberId: string) {
    try {
      const reviewsRef = collection(this.firestore, 'Avis');
      const q = query(reviewsRef, where('uidCoiffeur', '==', barberId));
      const reviewsSnapshot = await getDocs(q);

      this.reviews = [];

      for (const reviewDoc of reviewsSnapshot.docs) {
        const review = { id: reviewDoc.id, ...reviewDoc.data() } as Review;
        
        const clientDoc = await getDoc(doc(this.firestore, 'users', review.uidClient));
        if (clientDoc.exists()) {
          const userData = clientDoc.data();
          review.userData = {
            prenom: userData['prénom'],
            nom: userData['nom']
          };
          this.reviews.push(review);
        }
      }

      this.reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Erreur chargement avis:', error);
    }
  }
}
