import { Component } from '@angular/core';

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

  public toggleCard(cardName: 'standard' | 'premium'): void {
    this.expandedCards[cardName] = !this.expandedCards[cardName];
  }
}
