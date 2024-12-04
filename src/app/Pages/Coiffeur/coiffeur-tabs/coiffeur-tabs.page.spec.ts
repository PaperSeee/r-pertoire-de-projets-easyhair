import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoiffeurTabsPage } from './coiffeur-tabs.page';

describe('CoiffeurTabsPage', () => {
  let component: CoiffeurTabsPage;
  let fixture: ComponentFixture<CoiffeurTabsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoiffeurTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
