import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { Transaction } from '../models/Transaction.model';
import { TransactionStatus } from '../models/TransactionStatus.model';
import { TransactionType } from '../models/TransactionType.model';
import { ErrorPopUp } from '../shared/components/error-pop-up/error-pop-up';
import { InputPopUp } from '../shared/components/input-pop-up/input-pop-up';
import { LoadingPopUp } from '../shared/components/loading-pop-up/loading-pop-up';
import { PopUp } from '../shared/components/pop-up/pop-up';
import { SucessfulTransactionPopUp } from '../shared/components/sucessful-transaction-pop-up/sucessful-transaction-pop-up';
import { BankService } from './bank';

@Injectable({ providedIn: 'root' })
export class TransactionFlow {
  private readonly bank = inject(BankService);
  private readonly dialog = inject(MatDialog);

  // Input -> (destination check) -> confirm -> bank call. Back/error-continue return to input;
  // cancel aborts. Views refresh themselves through bank.revision().
  // Resolves to the approved transaction, or undefined if cancelled.
  async run(transactionType: TransactionType): Promise<Transaction | undefined> {
    const tx: Transaction = {
      transactionId: '',
      accountId: this.bank.currentAccountId() ?? '1001',
      recipientAccountId:
        transactionType === TransactionType.TransferOut ||
        transactionType === TransactionType.TransferIn
          ? null
          : (this.bank.currentAccountId() ?? '10001'),
      amount: 0,
      description: '',
      transactionType,
      dateCreated: new Date(),
      transferId: null,
      transactionStatus: TransactionStatus.Pending,
    };

    while (true) {
      const next = await firstValueFrom(
        this.dialog
          .open<InputPopUp, Transaction, boolean>(InputPopUp, { width: '700px', data: tx })
          .afterClosed(),
      );
      if (!next) return;

      if (transactionType === TransactionType.TransferOut) {
        tx.recipientAccountId = (tx.recipientAccountId ?? '').trim().toUpperCase();
        if (!this.bank.getAccount(tx.recipientAccountId)) {
          await this.showError('Destination account not found');
          continue;
        }
      }

      const confirmed = await firstValueFrom(
        this.dialog
          .open<PopUp, Transaction, boolean>(PopUp, { width: 'auto', height: 'auto', data: tx })
          .afterClosed(),
      );
      if (confirmed === undefined) return;
      if (!confirmed) continue;

      if (!(await this.showLoading(3000))) continue;
      const error = this.send(tx);
      if (error) {
        await this.showError(error);
        continue;
      }

      tx.transactionStatus = TransactionStatus.Approved;
      await firstValueFrom(
        this.dialog.open(SucessfulTransactionPopUp, { width: '700px', data: tx }).afterClosed(),
      );
      return tx;
    }
  }

  // BankService validates, creates and stores the record; returns '' on success.
  private send(tx: Transaction): string {
    const note = tx.description ?? '';
    switch (tx.transactionType) {
      case TransactionType.Deposit:
        return this.bank.deposit(tx.amount, note);
      case TransactionType.Withdraw:
        return this.bank.withdraw(tx.amount, note);
      default:
        return this.bank.transfer(tx.amount, tx.recipientAccountId ?? '', note);
    }
  }

  private showError(error: string): Promise<boolean | undefined> {
    return firstValueFrom(
      this.dialog
        .open<ErrorPopUp, { error: string }, boolean>(ErrorPopUp, {
          width: '700px',
          data: { error },
        })
        .afterClosed(),
    );
  }

  private async showLoading(ms: number): Promise<boolean> {
    const ref = this.dialog.open<LoadingPopUp, void, boolean>(LoadingPopUp, { width: 'auto' });
    const timer = setTimeout(() => ref.close(true), ms);
    const done = await firstValueFrom(ref.afterClosed());
    clearTimeout(timer);
    return done === true;
  }
}
