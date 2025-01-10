import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, getDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { AuthentificationService } from 'src/app/authentification.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  
  rdvId: string;
  messages: Message[] = [];
  nouveauMessage: string = '';
  titreDestinataire: string = '';
  estCoiffeur: boolean = false;
  private firestore = getFirestore();
  private unsubscribe: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthentificationService
  ) {
    this.rdvId = this.route.snapshot.paramMap.get('id');
  }

  async ngOnInit() {
    const user = await this.authService.getProfile();
    if (!user) return;

    const rdvDoc = await getDoc(doc(this.firestore, 'RDV', this.rdvId));
    if (rdvDoc.exists()) {
      const rdvData = rdvDoc.data();
      this.estCoiffeur = user.uid === rdvData['uidCoiffeur'];

      if (this.estCoiffeur) {
        // Récupérer le nom du client
        const clientDoc = await getDoc(doc(this.firestore, 'users', rdvData['uidClient']));
        if (clientDoc.exists()) {
          const clientData = clientDoc.data();
          this.titreDestinataire = `${clientData['prénom']} ${clientData['nom']}`;
        }
      } else {
        this.titreDestinataire = rdvData['nomCoiffeur'];
      }
    }

    this.subscribeToMessages();
  }

  private subscribeToMessages() {
    const messagesRef = collection(doc(this.firestore, 'RDV', this.rdvId), 'messages');
    const q = query(messagesRef, orderBy('dateEnvoi', 'asc'));
    
    this.unsubscribe = onSnapshot(q, (snapshot) => {
      this.messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      
      setTimeout(() => {
        this.content.scrollToBottom(300);
      }, 100);
    });
  }

  async envoyerMessage() {
    if (!this.nouveauMessage.trim()) return;

    const user = await this.authService.getProfile();
    if (!user) return;

    const messagesRef = collection(doc(this.firestore, 'RDV', this.rdvId), 'messages');
    await addDoc(messagesRef, {
      contenu: this.nouveauMessage.trim(),
      expediteurId: user.uid,
      dateEnvoi: new Date().toISOString(),
      estCoiffeur: this.estCoiffeur
    });

    this.nouveauMessage = '';
    this.content.scrollToBottom(300);
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

interface Message {
  id?: string;
  contenu: string;
  expediteurId: string;
  dateEnvoi: string;
  estCoiffeur: boolean;
}
