import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService, TransactionRecord } from '../../core/account.service';

@Component({
    selector: 'app-history',
    imports: [CurrencyPipe, DatePipe, RouterLink],
    templateUrl: './history.html',
})
export class History {
    private readonly accounts = inject(AccountService);

    protected readonly transactions = signal<TransactionRecord[] | null>(null);
    protected readonly error = signal('');

    constructor() {
        this.accounts.history().subscribe({
            next: (transactions) => this.transactions.set(transactions),
            error: () => this.error.set('Could not load your history.'),
        });
    }
}