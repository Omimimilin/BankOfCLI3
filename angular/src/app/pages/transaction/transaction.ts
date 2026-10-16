import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../core/account.service';

type TransactionKind = 'deposit' | 'withdraw' | 'transfer';

@Component({
    selector: 'app-transaction',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './transaction.html'
})
export class TransactionPage {
    private readonly accounts = inject(AccountService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly formBuilder = inject(FormBuilder);

    protected readonly kind = this.route.snapshot.data['kind'] as TransactionKind;
    protected readonly error = signal('');
    protected readonly form  = this.formBuilder.nonNullable.group({
        amount:  [0, [Validators.required, Validators.min(0.01)]],
        destinationUsername: [''],
    });

    protected submit(): void {
        if (this.form.invalid) {
            this.error.set('Enter an amount greater than 0.');
            return;
        }

        const { amount, destinationUsername } = this.form.getRawValue();
        const request = this.kind === 'deposit'
            ? this.accounts.deposit(amount)
            : this.kind === 'withdraw'
            ? this.accounts.withdraw(amount)
            : this.accounts.transfer(amount, destinationUsername.trim());
        
        if (this.kind === 'transfer' && !destinationUsername.trim()){
            this.error.set('Enter a username ot transfer to.');
            return;
        }
        request.subscribe({
            next: () => this.router.navigateByUrl('/dashboard'),
            error: () => this.error.set('Transaction failed.'),
        });

    }
}