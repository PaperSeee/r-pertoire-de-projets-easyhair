import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForfaitPage } from './forfait.page';

describe('ForfaitPage', () => {
  let component: ForfaitPage;
  let fixture: ComponentFixture<ForfaitPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForfaitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
