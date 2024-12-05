import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonProfilCoiffeurPage } from './mon-profil-coiffeur.page';

describe('MonProfilCoiffeurPage', () => {
  let component: MonProfilCoiffeurPage;
  let fixture: ComponentFixture<MonProfilCoiffeurPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MonProfilCoiffeurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
