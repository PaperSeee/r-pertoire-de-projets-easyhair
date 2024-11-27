import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InscriptionProfessionnelsPage } from './inscription-professionnels.page';

describe('InscriptionProfessionnelsPage', () => {
  let component: InscriptionProfessionnelsPage;
  let fixture: ComponentFixture<InscriptionProfessionnelsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InscriptionProfessionnelsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
