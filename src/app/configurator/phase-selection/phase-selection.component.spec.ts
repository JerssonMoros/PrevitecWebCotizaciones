import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseSelectionComponent } from './phase-selection.component';

describe('PhaseSelectionComponent', () => {
  let component: PhaseSelectionComponent;
  let fixture: ComponentFixture<PhaseSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhaseSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhaseSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
