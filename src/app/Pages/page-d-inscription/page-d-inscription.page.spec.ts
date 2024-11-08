import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageDInscriptionPage } from './page-d-inscription.page';

describe('PageDInscriptionPage', () => {
  let component: PageDInscriptionPage;
  let fixture: ComponentFixture<PageDInscriptionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageDInscriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
