import { Component, inject } from '@angular/core';
import { Card } from '../card/card';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { matArrowForwardFillOutline } from '@ng-icons/material-symbols/outline';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Transaction } from '../../../models/Transaction.model';
import { TransactionType } from '../../../models/TransactionType.model';

// The shape of the data the parent passes in.
export interface ConfirmPopUpData {
  transactionType: 'Withdraw' | 'Deposit' | 'Transfer';
  destinationAccount: string;
  amount: string;
}

const statusStyles: Record<TransactionType, string> = {
  WITHDRAW: 'border-red-500 bg-red-100 text-red-700',
  DEPOSIT: 'border-green-500 bg-green-100 text-green-700',
  TRANSFER_IN: 'border-yellow-500 bg-yellow-100 text-yellow-700',
  TRANSFER_OUT: 'border-yellow-500 bg-yellow-100 text-yellow-700',
};

@Component({
  selector: 'app-pop-up',
  styleUrl: './pop-up.css',
  templateUrl: './pop-up.html',
  viewProviders: [provideIcons({ matArrowForwardFillOutline })],
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, Card, NgIcon],
})
export class PopUp {
  // MAT_DIALOG_DATA holds whatever the parent passed in through `data`.
  protected readonly data = inject<Transaction>(MAT_DIALOG_DATA);
  usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  title =
    (<Record<string, string>>{ WITHDRAW: 'Withdrawal', DEPOSIT: 'Deposit' })[
      this.data.transactionType
    ] ?? 'Transfer';
  style = statusStyles[this.data.transactionType];
  redStyle = statusStyles[TransactionType.Withdraw];
  greenStyle = statusStyles[TransactionType.Deposit];
  protected readonly icon = 'matArrowForwardFillOutline';
}
