import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, Auth, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, Firestore } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private firebaseApp = initializeApp(environment.firebaseConfig);
  private auth: Auth = getAuth(this.firebaseApp);
  private firestore: Firestore = getFirestore(this.firebaseApp);

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

  // Enregistrer un utilisateur avec Google
  async registerUserWithGoogle(user: any) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    console.log('Registering user with data:', userData); // Pour débogage
    return await setDoc(userRef, userData, { merge: true });
  }
}
