import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputPopUp } from './input-pop-up';

describe('InputPopUp', () => {
  let component: InputPopUp;
  let fixture: ComponentFixture<InputPopUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputPopUp],
    }).compileComponents();

    fixture = TestBed.createComponent(InputPopUp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
