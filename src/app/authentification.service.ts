import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, Auth, User, deleteUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, Firestore, getDoc, deleteDoc } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private firebaseApp = initializeApp(environment.firebaseConfig);
  private auth: Auth = getAuth(this.firebaseApp);
  private firestore: Firestore = getFirestore(this.firebaseApp);

  constructor(private router: Router) { }

  // Fonction d'inscription
  async registerUser(email: string, password: string, prénom: string, nom: string, genre: string, telephone: string) {
    try {
      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Sauvegarder les données additionnelles dans Firestore
      const userData = {
        uid: userCredential.user.uid,
        email: email,
        telephone: telephone,
        prénom: prénom,
        nom: nom,
        genre: genre,
        createdAt: new Date().toISOString(),
        role: 'user'
      };

      // Créer/mettre à jour le document dans la collection 'users'
      await setDoc(doc(this.firestore, 'users', userCredential.user.uid), userData);

      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  // fonction de connexion
  async loginUser(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // fonction de réinitialisation de mot de passe
  async resetPassword(email: string) {
    return await sendPasswordResetEmail(this.auth, email);
  }

  // fonction de déconnexion
  async signOut() {
    return await signOut(this.auth);
  }

  // fonction pour identifier le profil connecté
  async getProfile(): Promise<User | null> {
    return this.auth.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  // Enregistrer un utilisateur avec Google

  async registerUserWithGoogle(user: any) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
  
    // Préparer les données utilisateur pour un nouvel enregistrement
    const userData = {
      uid: user.uid,
      email: user.email,
      prénom: user.prénom || '',
      nom: user.nom || '',
      telephone: user.telephone || '',
      genre: user.genre || '',
      photoURL: user.photoURL || '',
      createdAt: user.createdAt || new Date().toISOString(),
      role: user.role || 'user'
    };
  
    console.log('Registering new user with data:', userData);
  
    // Enregistrer uniquement si c'est un nouvel utilisateur
    return await setDoc(userRef, userData);
  }
  
  

  async userExists(uid: string): Promise<boolean> {
    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    return userDoc.exists();
  }  

  // inscription d'un professionnel
  
  async registerProfessional(email: string, password: string, userData: any) {
    try {
      // 1. Créer l'utilisateur dans Authentication
      const userCredential = await createUserWithEmailAndPassword(
        this.auth, 
        email, 
        password
      );

      // 2. Créer le document dans la collection Coiffeurs
      const coiffeurRef = doc(this.firestore, 'Coiffeurs', userCredential.user.uid);
      
      // 3. Ajouter toutes les données + quelques champs supplémentaires
      await setDoc(coiffeurRef, {
        ...userData,
        uid: userCredential.user.uid,
        email: email, // S'assurer que l'email est bien inclus
        createdAt: new Date().toISOString(),
        status: 'active'
      });

      return userCredential.user;
    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
      throw error;
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      const user = await this.getProfile();
      if (user) {
        // Vérifier d'abord dans la collection 'users'
        const userDoc = doc(this.firestore, 'users', user.uid);
        const userSnap = await getDoc(userDoc);
        
        // Vérifier dans la collection 'Coiffeurs'
        const coiffeurDoc = doc(this.firestore, 'Coiffeurs', user.uid);
        const coiffeurSnap = await getDoc(coiffeurDoc);

        // Supprimer le document approprié
        if (userSnap.exists()) {
          await deleteDoc(userDoc);
        }
        if (coiffeurSnap.exists()) {
          await deleteDoc(coiffeurDoc);
        }

        // Supprimer le compte Firebase Auth en dernier
        await deleteUser(user);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      throw error;
    }
  }

}








