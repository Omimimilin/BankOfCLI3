import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Account } from '../models/Account.model';
import { Transaction } from '../models/Transaction.model';
import { TransactionStatus } from '../models/TransactionStatus.model';
import { TransactionType } from '../models/TransactionType.model';
import { firstValueFrom } from 'rxjs';


interface ResponseContract<T> {
  success: boolean;
  data: T | null;
  errors: string[] | null;
}

interface ApiUser {
  accountId: number;
  username: string;
  name: string;
  balance: number;
}

interface ApiTransaction {
  id: number;
  amount: number;
  transferType: string;
  timestamp: string;
  sourceUsername: string;
  destinationUsername: string | null;
  description?: string | null;
}

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
  // empty so calls go to /api on the same site (see proxy.conf.json)
  private readonly apiUrl = '';
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
    this.loadMe();
  }

  loadMe(): Promise<void> {
    const token = localStorage.getItem('jwt');

    return firstValueFrom(
      this.http.get<ResponseContract<ApiUser>>(`${this.apiUrl}/api/users/me`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    )
      .then((response) => {
        const user = response.data;
        if (!response.success || !user) {
          this.accountsLoaded.set(true);
          this.transactionsLoaded.set(true);
          return;
        }
        const record: AccountRecord = {
          accountId: user.username,
          accountPin: '',
          accountName: user.name,
          balance: Number(user.balance),
          dateCreated: new Date().toISOString(),
        };

        this.accounts.set(record.accountId, record);
        this.currentAccountId.set(record.accountId);
        this.accountsLoaded.set(true);
        this.touch();
        this.loadHistory();
      })
      .catch(() => {
        this.accountsLoaded.set(true);
        this.transactionsLoaded.set(true);
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

  async deposit(amount: number, description: string): Promise<string> {
    const username = this.currentAccountId();
    if (!username) return 'You are not signed in.';
    const error = this.checkAmount(amount);
    if (error) return error;

    const token = localStorage.getItem('jwt');

    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/api/transactions/deposit`, {
          username,
          amount,
          description: description.trim() || null
        }, {
          headers: token ? { Authorization: `Bearer ${token}`} : {},
          }),
      );
    } catch (error) {
      return this.readError(error, 'Deposit failed.');
    }

    this.changeBalance(username, amount);
    this.touch();
    await this.loadMe();
    return '';
  }


  private readError(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as ResponseContract<unknown> | undefined;
      return body?.errors?.[0] ?? fallback;
    }
    return fallback;
  }

  async withdraw(amount: number, description: string): Promise<string> {
    const username= this.currentAccountId();
    if (!username) return 'You are not signed in.';
    const error = this.checkAmount(amount);
    if (error) return error;

    const token = localStorage.getItem('jwt');
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/api/transactions/withdraw`, {
          username,
          amount,
          description: description.trim() || null
        }, {
          headers: token ? { Authorization: `Bearer ${token}`} : {},
        })
      );
    } catch (error) {
      return this.readError(error, 'Withdrawal failed.');
    }
    this.changeBalance(username, -amount);
    this.touch();
    await this.loadMe();
    return '';
  }

  async transfer(amount: number, recipientAccountId: string, description: string): Promise<string> {
    const username = this.currentAccountId();
    if (!username) return 'You are not signed in.';
    const error = this.checkAmount(amount);
    if (error) return error;

    const destinationUsername = recipientAccountId.trim();
    if (!destinationUsername) return 'Destination account not found.';
    if(destinationUsername === username) return 'You cannot transfer to the same account.';
    
    const token = localStorage.getItem('jwt');
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/api/transactions/transfer`, {
          username,
          destinationUsername,
          amount,
          description: description.trim() || null
        }, {
          headers: token ? { Authorization: `Bearer ${token}`} : {},
        })
      )
    } catch (error) {
      return this.readError(error, 'Transfer failed.');
    }
    this.changeBalance(username, -amount);
    this.touch();
    await this.loadMe();
    return '';
  }

  async userExists(username: string): Promise<boolean> {
    const name = username.trim();
    if (!name) return false;
    const token = localStorage.getItem('jwt');
    try {
      const response = await firstValueFrom(
        this.http.get<ResponseContract<ApiUser>>(`${this.apiUrl}/api/users`, {
          params: { username: name },
          headers: token ? { Authorization: `Bearer ${token}`} : {},
        }),
      );
      return response.success && !!response.data;
    } catch (error) {
      return false;
    }
  }

  loadHistory(): void {
    const username = this.currentAccountId();
    const token = localStorage.getItem('jwt');
    if (!username) {
      this.transactionsLoaded.set(true);
      return;
    }

    this.http
      .get<ApiTransaction[]>(`${this.apiUrl}/api/transactions`, {
        params: { username },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .subscribe({
        next: (rows) => {
          // Deposits and withdrawals have no destination, and the history query
          // returns every one of those rows. Keep the rows this account sent.
          const mine = rows.filter((row) => row.sourceUsername === username);
          this.loadTransactions(mine.map((row) => this.toRecord(username, row)));
          this.transactionsLoaded.set(true);
          this.touch();
        },
        error: () => {
          this.transactionsLoaded.set(true);
        },
      });
  }

  private toRecord(username: string, row: ApiTransaction): TransactionRecord {
    const other =
      row.destinationUsername && row.destinationUsername !== username
        ? row.destinationUsername
        : row.sourceUsername !== username
          ? row.sourceUsername
          : null;

    return {
      transactionId: String(row.id),
      accountId: username,
      recipientAccountId: other,
      amount: Number(row.amount),
      description: row.description ?? null,
      transactionType: this.toType(row.transferType),
      dateCreated: new Date(row.timestamp).toISOString(),
      transferId: null,
      transactionStatus: TransactionStatus.Approved,
    };
  }

  private toType(transferType: string): TransactionType {
    switch (transferType) {
      case 'deposit':
        return TransactionType.Deposit;
      case 'withdraw':
        return TransactionType.Withdraw;
      case 'transfer_in':
        return TransactionType.TransferIn;
      default:
        return TransactionType.TransferOut;
    }
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
