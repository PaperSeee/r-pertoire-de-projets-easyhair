import { Injectable } from '@angular/core';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private storage = getStorage();
  private firestore = getFirestore();

  constructor() { }

  async uploadImage(uid: string, imageData: string, type: 'profile' | 'hairstyle'): Promise<string> {
    // Générer un ID unique pour les photos de coupe
    const imageId = type === 'hairstyle' ? `${Date.now()}_${Math.random().toString(36).slice(2)}` : 'profile';
    
    // Définir le chemin selon le type
    const path = type === 'profile' 
      ? `profiles/${uid}/profile.jpg`
      : `hairstyles/${uid}/${imageId}.jpg`;

    const storageRef = ref(this.storage, path);
    
    // Upload de l'image
    await uploadString(storageRef, imageData, 'data_url', {
      contentType: 'image/jpeg'
    });

    // Récupérer l'URL
    return await getDownloadURL(storageRef);
  }

  async updateUserPhoto(uid: string, photoUrl: string, type: 'profile' | 'hairstyle'): Promise<void> {
    const userRef = doc(this.firestore, 'Coiffeurs', uid);
    const userDoc = await getDoc(userRef);

    if (type === 'profile') {
      // Mise à jour ou création du champ photoURL
      if (userDoc.exists()) {
        await updateDoc(userRef, { photoURL: photoUrl });
      } else {
        await setDoc(userRef, { photoURL: photoUrl }, { merge: true });
      }
    } else {
      // Gestion des photos de coupe
      const photos = userDoc.exists() ? (userDoc.data()['photosCoupes'] || []) : [];
      await updateDoc(userRef, {
        photosCoupes: [...photos, photoUrl]
      });
    }
  }
}
