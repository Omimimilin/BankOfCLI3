import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/Account.model';
import { Transaction } from '../models/Transaction.model';
import { TransactionStatus } from '../models/TransactionStatus.model';
import { TransactionType } from '../models/TransactionType.model';

interface AccountRecord {
  accountId: string;
  accountPin: string;
  accountName: string;
  balance: number;
  dateCreated: string;
}

interface TransactionRecord {
  transactionId: string;
  accountId: string;
  recipientAccountId?: string | null;
  amount: number;
  description?: string | null;
  transactionType: TransactionType;
  dateCreated: string;
  transferId: string | null;
  transactionStatus: TransactionStatus;
}

@Injectable({ providedIn: 'root' })
export class BankService {
  private readonly accountIdKey = 'currentAccountId';
  private readonly accountsKey = 'bankAccounts';
  private readonly transactionsKey = 'bankTransactions';

  readonly accountsLoaded = signal(false);
  readonly transactionsLoaded = signal(false);
  readonly revision = signal(0);
  readonly currentAccountId = signal<string | null>(null);

  private accounts = new Map<string, AccountRecord>();
  private transactions = new Map<string, TransactionRecord>();
  private seedTransactionIds = new Set<string>();
  private sequence = 0;

  constructor(private readonly http: HttpClient) {
    const savedId = localStorage.getItem(this.accountIdKey);
    if (savedId) this.currentAccountId.set(savedId);
    this.loadFromFile();
  }

  loadFromFile(): void {
    this.http.get<AccountRecord[]>('accounts.json').subscribe((accounts) => {
      this.load(accounts);
      this.restoreAccounts();
      this.accountsLoaded.set(true);

      this.http.get<TransactionRecord[]>('transaction-records.json').subscribe((records) => {
        this.loadTransactions(records);
        this.restoreTransactions();
        this.transactionsLoaded.set(true);
      });
    });
  }

  load(accountSeed: AccountRecord[]): void {
    this.accounts.clear();
    for (const record of accountSeed) {
      this.accounts.set(record.accountId, {
        ...record,
        dateCreated: new Date(record.dateCreated).toISOString(),
      });
    }
  }

  getAccount(accountId: string): Account | undefined {
    const record = this.accounts.get(accountId);
    if (!record) return undefined;
    return { ...record, dateCreated: new Date(record.dateCreated) };
  }

  getTransactions(accountId: string): Transaction[] {
    return [...this.transactions.values()]
      .filter((record) => record.accountId === accountId)
      .sort((a, b) => b.dateCreated.localeCompare(a.dateCreated))
      .map((record) => ({ ...record, dateCreated: new Date(record.dateCreated) }));
  }

  login(accountId: string, accountPin: string): string {
    const account = this.getAccount(accountId);
    if (!account || account.accountPin !== accountPin) {
      return 'Invalid credentials. Please try again, your account may not exist.';
    }
    this.currentAccountId.set(accountId);
    localStorage.setItem(this.accountIdKey, accountId);
    return '';
  }

  logout(): void {
    this.currentAccountId.set(null);
    localStorage.removeItem(this.accountIdKey);
  }

  register(accountId: string, accountPin: string, accountName: string): string {
    if (this.accounts.has(accountId)) {
      return 'Account ID already exists. Please try a different account ID.';
    }
    this.accounts.set(accountId, {
      accountId,
      accountPin,
      accountName,
      balance: 0,
      dateCreated: new Date().toISOString(),
    });
    this.saveAccounts();
    this.touch();
    return '';
  }

  deposit(amount: number, description: string): string {
    const accountId = this.currentAccountId();
    if (!accountId) return 'You are not signed in.';
    const error = this.checkAmount(amount);
    if (error) return error;

    this.addTransaction({
      transactionId: this.nextId('tx'),
      accountId,
      recipientAccountId: null,
      amount,
      description: description.trim() || null,
      transactionType: TransactionType.Deposit,
      dateCreated: new Date().toISOString(),
      transferId: null,
      transactionStatus: TransactionStatus.Approved,
    });
    this.changeBalance(accountId, amount);
    this.touch();
    return '';
  }

  withdraw(amount: number, description: string): string {
    const accountId = this.currentAccountId();
    if (!accountId) return 'You are not signed in.';
    const error = this.checkAmount(amount);
    if (error) return error;

    const account = this.accounts.get(accountId);
    if (!account || amount > account.balance) {
      return 'Insufficient funds.';
    }

    this.addTransaction({
      transactionId: this.nextId('tx'),
      accountId,
      recipientAccountId: null,
      amount,
      description: description.trim() || null,
      transactionType: TransactionType.Withdraw,
      dateCreated: new Date().toISOString(),
      transferId: null,
      transactionStatus: TransactionStatus.Approved,
    });
    this.changeBalance(accountId, -amount);
    this.touch();
    return '';
  }

  transfer(amount: number, recipientAccountId: string, description: string): string {
    const accountId = this.currentAccountId();
    if (!accountId) return 'You are not signed in.';
    const error = this.checkAmount(amount);
    if (error) return error;

    const recipientId = recipientAccountId.trim().toUpperCase();
    if (!this.accounts.has(recipientId)) return 'Destination account not found.';
    if (recipientId === accountId) return 'You cannot transfer to the same account.';

    const account = this.accounts.get(accountId);
    if (!account || amount > account.balance) return 'Insufficient funds.';

    const when = new Date().toISOString();
    const transferId = this.nextId('tr');
    const note = description.trim() || null;

    this.addTransaction({
      transactionId: this.nextId('tx'),
      accountId,
      recipientAccountId: recipientId,
      amount,
      description: note,
      transactionType: TransactionType.TransferOut,
      dateCreated: when,
      transferId,
      transactionStatus: TransactionStatus.Approved,
    });
    this.addTransaction({
      transactionId: this.nextId('tx'),
      accountId: recipientId,
      recipientAccountId: accountId,
      amount,
      description: note,
      transactionType: TransactionType.TransferIn,
      dateCreated: when,
      transferId,
      transactionStatus: TransactionStatus.Approved,
    });
    this.changeBalance(accountId, -amount);
    this.changeBalance(recipientId, amount);
    this.touch();
    return '';
  }

  private loadTransactions(records: TransactionRecord[]): void {
    this.transactions.clear();
    this.seedTransactionIds.clear();
    for (const record of records) {
      this.transactions.set(record.transactionId, {
        ...record,
        dateCreated: new Date(record.dateCreated).toISOString(),
      });
      this.seedTransactionIds.add(record.transactionId);
    }
  }

  private addTransaction(record: TransactionRecord): void {
    this.transactions.set(record.transactionId, record);
    this.saveTransactions();
  }

  private changeBalance(accountId: string, delta: number): void {
    const record = this.accounts.get(accountId);
    if (!record) return;
    record.balance = Math.round((record.balance + delta) * 100) / 100;
    this.saveAccounts();
  }

  private checkAmount(amount: number): string {
    if (!Number.isFinite(amount) || amount <= 0) return 'Enter an amount greater than 0.';
    return '';
  }

  private restoreAccounts(): void {
    const saved = localStorage.getItem(this.accountsKey);
    if (!saved) return;
    for (const record of JSON.parse(saved) as AccountRecord[]) {
      this.accounts.set(record.accountId, record);
    }
  }

  private restoreTransactions(): void {
    const saved = localStorage.getItem(this.transactionsKey);
    if (!saved) return;
    for (const record of JSON.parse(saved) as TransactionRecord[]) {
      if (!this.transactions.has(record.transactionId)) {
        this.transactions.set(record.transactionId, record);
      }
    }
  }

  private saveAccounts(): void {
    localStorage.setItem(this.accountsKey, JSON.stringify([...this.accounts.values()]));
  }

  private saveTransactions(): void {
    const extra = [...this.transactions.values()].filter(
      (record) => !this.seedTransactionIds.has(record.transactionId),
    );
    localStorage.setItem(this.transactionsKey, JSON.stringify(extra));
  }

  private nextId(prefix: string): string {
    this.sequence += 1;
    return `${prefix}-${Date.now()}-${this.sequence}`;
  }

  private touch(): void {
    this.revision.update((value) => value + 1);
  }
}
