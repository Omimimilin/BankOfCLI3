import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Api } from './api';

export interface Account {
    id: number;
    username: string;
    name: string;
    balance: number;
}

export interface TransactionRecord {
    id: number;
    amount: number;
    transferType: string;
    timestamp: string;
    destinationAccount?: { username: string } | null;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
    private readonly http = inject(HttpClient);
    private readonly api = inject(Api);

    current() {
        return this.http.get<Account>(`${this.api.baseUrl}/api/users/me`)
    }

    deposit(amount: number) {
        return this.http.post(`${this.api.baseUrl}/api/transactions/deposit`, {amount});
    }

    withdraw(amount: number) {
        return this.http.post(`${this.api.baseUrl}/api/transactions/withdraw`, {amount});
    }

    transfer(amount: number, destinationUsername: string) {
        return this.http.post(`${this.api.baseUrl}/api/transactions/transfer`, {
            amount,
            destinationUsername,
        });
    }

    history() {
        return this.http.get<TransactionRecord[]>(`${this.api.baseUrl}/api/transactions`);
    }
}