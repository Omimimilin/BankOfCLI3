import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TransactionTable } from './transaction-table';

describe('TransactionTable', () => {
  let component: TransactionTable;
  let fixture: ComponentFixture<TransactionTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTable],
      providers: [provideHttpClient(), provideRouter([])],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TransactionTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
