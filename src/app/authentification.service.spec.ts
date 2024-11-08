import { TestBed } from '@angular/core/testing';
import { AuthentificationService } from './authentification.service';

describe('AuthentificationService', () => {
  let service: AuthentificationService;

  // Avant chaque test, configure l'environnement de test et crée une instance du service
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthentificationService);
  });

  // Test qui vérifie si le service a été correctement créé
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

