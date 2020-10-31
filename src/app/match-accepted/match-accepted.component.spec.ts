import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchAcceptedComponent } from './match-accepted.component';

describe('MatchAcceptedComponent', () => {
  let component: MatchAcceptedComponent;
  let fixture: ComponentFixture<MatchAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchAcceptedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
