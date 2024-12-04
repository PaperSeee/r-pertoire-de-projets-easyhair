import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesInformationsCoiffeurPage } from './mes-informations-coiffeur.page';

describe('MesInformationsCoiffeurPage', () => {
  let component: MesInformationsCoiffeurPage;
  let fixture: ComponentFixture<MesInformationsCoiffeurPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MesInformationsCoiffeurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
