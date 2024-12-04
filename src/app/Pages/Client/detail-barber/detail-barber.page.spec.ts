import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailBarberPage } from './detail-barber.page';

describe('DetailBarberPage', () => {
  let component: DetailBarberPage;
  let fixture: ComponentFixture<DetailBarberPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBarberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
