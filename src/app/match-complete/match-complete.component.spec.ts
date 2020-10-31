import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchCompleteComponent } from './match-complete.component';

describe('MatchCompleteComponent', () => {
  let component: MatchCompleteComponent;
  let fixture: ComponentFixture<MatchCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchCompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
