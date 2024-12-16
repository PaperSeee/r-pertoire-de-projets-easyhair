import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesHorairesPage } from './mes-horaires.page';

describe('MesHorairesPage', () => {
  let component: MesHorairesPage;
  let fixture: ComponentFixture<MesHorairesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MesHorairesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
