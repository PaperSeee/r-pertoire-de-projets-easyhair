import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InspiPagePage } from './inspi-page.page';

describe('InspiPagePage', () => {
  let component: InspiPagePage;
  let fixture: ComponentFixture<InspiPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InspiPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
