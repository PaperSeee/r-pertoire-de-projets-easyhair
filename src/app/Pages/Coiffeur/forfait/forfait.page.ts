import { Component, ChangeDetectorRef } from '@angular/core';

interface ExpandedCards {
  standard: boolean;
  premium: boolean;
}

@Component({
  selector: 'app-forfait',
  templateUrl: './forfait.page.html',
  styleUrls: ['./forfait.page.scss'],
})
export class ForfaitPage {
  public expandedCards: ExpandedCards = {
    standard: false,
    premium: false,
  };

  constructor(private cdr: ChangeDetectorRef) {}

  public toggleCard(cardName: 'standard' | 'premium'): void {
    const isCurrentlyExpanded = this.expandedCards[cardName];

    // Ferme toutes les cartes
    Object.keys(this.expandedCards).forEach((key) => {
      this.expandedCards[key as keyof ExpandedCards] = false;
    });

    // Si la carte n'était pas déjà ouverte, on l'ouvre
    if (!isCurrentlyExpanded) {
      this.expandedCards[cardName] = true;
    }

    this.cdr.detectChanges();
  }
}
