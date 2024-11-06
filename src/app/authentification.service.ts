import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(public nfFireAuth: AngularFireAuth) { }

  async registerUser(email:string, password:string){
  
    return await this.nfFireAuth.createUserWithEmailAndPassword(email, password)
  }

  async loginUser(email:string,password:string){
    return await this.nfFireAuth.signInWithEmailAndPassword(email,password)
  }

  async resetPassword(email:string){
    return await this.nfFireAuth.sendPasswordResetEmail(email)
  }

  async signOut(){
    return await this.nfFireAuth.signOut()
  }

  async getProfile(){
    return await this.nfFireAuth.currentUser
  }

}
