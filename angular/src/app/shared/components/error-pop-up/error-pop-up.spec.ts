import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorPopUp } from './error-pop-up';

describe('ErrorPopUp', () => {
  let component: ErrorPopUp;
  let fixture: ComponentFixture<ErrorPopUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorPopUp],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorPopUp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
