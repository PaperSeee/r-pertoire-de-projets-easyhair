import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrendreRdvPage } from './prendre-rdv.page';

describe('PrendreRdvPage', () => {
  let component: PrendreRdvPage;
  let fixture: ComponentFixture<PrendreRdvPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrendreRdvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
