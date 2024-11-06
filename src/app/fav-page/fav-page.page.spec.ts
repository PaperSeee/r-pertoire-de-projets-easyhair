import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavPagePage } from './fav-page.page';

describe('FavPagePage', () => {
  let component: FavPagePage;
  let fixture: ComponentFixture<FavPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
