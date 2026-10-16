import { Component, computed, signal, effect, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Transaction } from '../../../models/Transaction.model';
import { Input } from '../input/input';
import { Card } from '../card/card';

@Component({
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, Input, Card],
  selector: 'app-input-pop-up',
  styleUrl: './input-pop-up.css',
  templateUrl: './input-pop-up.html',
})
export class InputPopUp {
  protected readonly data = inject<Transaction>(MAT_DIALOG_DATA);
  title =
    (<Record<string, string>>{ WITHDRAW: 'Withdrawal', DEPOSIT: 'Deposit' })[
      this.data.transactionType
    ] ?? 'Transfer';
  badge =
    (<Record<string, string>>{
      WITHDRAW: 'bg-red-100 text-red-700',
      DEPOSIT: 'bg-green-100 text-green-700',
    })[this.data.transactionType] ?? 'bg-yellow-100 text-yellow-700';
  notes = signal(this.data.description ?? '');
  amount = signal(this.data.amount ? String(this.data.amount) : '');
  destinationAccount = signal(this.data.recipientAccountId ?? '');
  // Amounts are JS doubles; past ~9e15 they silently round, so cap well below that.
  protected readonly max = 999_999_999.99;
  protected overMax = computed(() => +this.amount() > this.max);
  protected readonly needsDestination =
    this.data.transactionType === 'TRANSFER_IN' || this.data.transactionType === 'TRANSFER_OUT';
  protected invalid = computed(
    () =>
      !(+this.amount() > 0) ||
      this.overMax() ||
      (this.needsDestination && this.destinationAccount().trim() === ''),
  );
  constructor() {
    effect(() => {
      this.data.amount = +this.amount();
      this.data.recipientAccountId = this.destinationAccount();
      this.data.description = this.notes();
    });
  }
}
