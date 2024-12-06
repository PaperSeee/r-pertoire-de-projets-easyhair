import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage {
  name: string = '';
  email: string = '';
  message: string = '';
  prenom: string = '';
  nom: string = '';
  typeProbleme: string = '';
  adresseIntervention: string = '';

  constructor(private location: Location) {}

  onSubmit() {
    // Handle form submission
  }

  submitForm() {
    if (!this.prenom || !this.nom || !this.email || !this.typeProbleme || !this.adresseIntervention || !this.message) {
      alert('Veuillez remplir tous les champs du formulaire');
      return;
    }

    const email = 'easyhairapp@gmail.com';
    const ticketNumber = Math.floor(Math.random() * 10000) + 1; // Génère un numéro de ticket aléatoire
    const subject = `Problème utilisateur : ticket ${ticketNumber}`;
    const body = 
`Informations du contact :
------------------------
Prénom : ${this.prenom}
Nom : ${this.nom}
Email : ${this.email}
Type de problème : ${this.typeProbleme}
Adresse : ${this.adresseIntervention}

Message :
------------------------
${this.message}`;

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  goBack() {
    this.location.back();
  }
}