import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { BankService } from '../../service/bank';
import { Button } from '../../shared/components/button/button';
import { Card } from '../../shared/components/card/card';
import { Input } from '../../shared/components/input/input';

@Component({
  selector: 'app-transaction-page',
  imports: [Card, Input, Button, RouterLink],
  templateUrl: './transaction-page.html',
})
export class TransactionPage {
  private readonly bank = inject(BankService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly kind = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('kind') ?? '')),
    { initialValue: '' },
  );

  protected readonly amount = signal('');
  protected readonly description = signal('');
  protected readonly recipientAccountId = signal('');
  protected readonly error = signal('');

  protected readonly title = computed(() => {
    switch (this.kind()) {
      case 'deposit':
        return 'Deposit';
      case 'withdraw':
        return 'Withdraw';
      case 'transfer':
        return 'Transfer';
      default:
        return 'Transaction';
    }
  });

  protected readonly isTransfer = computed(() => this.kind() === 'transfer');

  protected submit(): void {
    const amount = Number(this.amount());
    const note = this.description();
    let error = '';

    switch (this.kind()) {
      case 'deposit':
        error = this.bank.deposit(amount, note);
        break;
      case 'withdraw':
        error = this.bank.withdraw(amount, note);
        break;
      case 'transfer':
        error = this.bank.transfer(amount, this.recipientAccountId(), note);
        break;
      default:
        error = 'Unknown transaction.';
    }

    this.error.set(error);
    if (!error) this.router.navigate(['/dashboard']);
  }
}
