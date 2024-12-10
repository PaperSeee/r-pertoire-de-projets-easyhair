import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthentificationService } from 'src/app/authentification.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
})
export class DeleteAccountPage {
  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async confirmDelete() {
    const alert = await this.alertController.create({
      header: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.deleteAccount();
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAccount() {
    try {
      await this.authService.deleteAccount();
      this.router.navigate(['/connexion']);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }
}
