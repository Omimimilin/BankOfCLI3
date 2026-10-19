import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SucessfulTransactionPopUp } from './sucessful-transaction-pop-up';

describe('SucessfulTransactionPopUp', () => {
  let component: SucessfulTransactionPopUp;
  let fixture: ComponentFixture<SucessfulTransactionPopUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucessfulTransactionPopUp],
    }).compileComponents();

    fixture = TestBed.createComponent(SucessfulTransactionPopUp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
