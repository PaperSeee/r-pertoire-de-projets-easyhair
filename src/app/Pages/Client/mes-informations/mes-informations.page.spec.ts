import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesInformationsPage } from './mes-informations.page';

describe('MesInformationsPage', () => {
  let component: MesInformationsPage;
  let fixture: ComponentFixture<MesInformationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MesInformationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
