// Service pour l'authentification par email/password
import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(public nfFireAuth: AngularFireAuth) { }

  // fonction d'inscription
  async registerUser(email:string, password:string){
  
    return await this.nfFireAuth.createUserWithEmailAndPassword(email, password)
  }

  // fonction de connexion
  async loginUser(email:string,password:string){
    return await this.nfFireAuth.signInWithEmailAndPassword(email,password)
  }

  // fonction de renitialisation de mdp
  async resetPassword(email:string){
    return await this.nfFireAuth.sendPasswordResetEmail(email)
  }

  // fonction de déconnexion
  async signOut(){
    return await this.nfFireAuth.signOut()
  }

  // fonction pour identifier le profil connecté
  async getProfile(){
    return await this.nfFireAuth.currentUser
  }

}
