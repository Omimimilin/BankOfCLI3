import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { Card } from '../card/card';
import { Transaction } from '../../../models/Transaction.model';
import { TransactionStatus } from '../../../models/TransactionStatus.model';

@Component({
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, Card],
  selector: 'app-sucessful-transaction-pop-up',
  styleUrl: './sucessful-transaction-pop-up.css',
  templateUrl: './sucessful-transaction-pop-up.html',
})
export class SucessfulTransactionPopUp {
  protected readonly data = inject<Transaction>(MAT_DIALOG_DATA);
  protected readonly approved = this.data.transactionStatus === TransactionStatus.Approved;
  protected readonly usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  title =
    (<Record<string, string>>{ WITHDRAW: 'Withdrawal', DEPOSIT: 'Deposit' })[
      this.data.transactionType
    ] ?? 'Transfer';
}
