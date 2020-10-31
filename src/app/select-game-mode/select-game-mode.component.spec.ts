import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGameModeComponent } from './select-game-mode.component';

describe('SelectGameModeComponent', () => {
  let component: SelectGameModeComponent;
  let fixture: ComponentFixture<SelectGameModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectGameModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGameModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
