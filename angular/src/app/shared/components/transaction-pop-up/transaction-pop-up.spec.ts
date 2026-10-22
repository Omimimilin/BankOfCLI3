import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionPopUp } from './transaction-pop-up';

describe('TransactionPopUp', () => {
  let component: TransactionPopUp;
  let fixture: ComponentFixture<TransactionPopUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionPopUp],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionPopUp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
