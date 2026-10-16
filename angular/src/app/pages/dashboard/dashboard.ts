import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../../core/account.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
    selector: 'app-dashboard',
    imports: [CurrencyPipe, RouterLink],
    templateUrl: './dashboard.html',
})
export class Dashboard {
    private readonly accounts = inject(AccountService);
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    protected readonly name = signal('');
    protected readonly balance = signal<number | null>(null);
    protected readonly error = signal('');

    constructor() {
        this.accounts.current().subscribe({
            next: (account) => {
                this.name.set(account.name);
                this.balance.set(account.balance);
            },
            error: () => this.error.set('Could not load your balance.'),
        });
    }

    protected logout(): void {
        this.auth.logout();
        this.router.navigateByUrl('/login');
    }
}