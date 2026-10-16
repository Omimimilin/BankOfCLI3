import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matChevronLeftFillOutline,
  matChevronRightFillOutline,
} from '@ng-icons/material-symbols/outline';
import { TransactionType } from '../../../models/TransactionType.model';
import { BankService } from '../../../service/bank';
import { TransactionFlow } from '../../../service/transaction-flow';
import { Button } from '../../../shared/components/button/button';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { Input } from '../../../shared/components/input/input';
import { Label } from '../../../shared/components/label/label';
import { LoadingRow } from '../../../shared/components/loading-row/loading-row';

interface Transaction {
  id: string;
  date: string;
  category: string;
  destination: string;
  status: string;
  amount: number;
  note: string;
}

@Component({
  imports: [
    FormsModule,
    NgIcon,
    Button,
    Dropdown,
    Input,
    Label,
    LoadingRow,
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
  ],
  selector: 'app-transaction-table',
  styleUrl: './transaction-table.css',
  templateUrl: './transaction-table.html',
  viewProviders: [provideIcons({ matChevronLeftFillOutline, matChevronRightFillOutline })],
})
export class TransactionTable {
  private readonly bank = inject(BankService);
  private readonly flow = inject(TransactionFlow);
  protected readonly types = TransactionType;

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  // A signal so a new payment redraws the table in the same visit.
  protected readonly tableData = signal<Transaction[]>([]);

  currentPage = 1;
  rowsPerPage = 5;
  totalPages = 0;

  // form values
  searchString: string = '';
  orderBy: string = '';
  sortDirection: string = '';
  selectedCategory: string = '';

  // menu values
  // Tried in order; the CDK uses the first one that fits on screen
  menuPositions: ConnectedPosition[] = [
    // Left of the button, top edges aligned
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -8 },
    // Below, right edges aligned
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 },
    // Below, left edges aligned (mobile, where the button wraps to the left)
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
  ];

  constructor() {
    effect(() => {
      this.bank.revision();
      if (!this.bank.transactionsLoaded()) return;
      const id = this.bank.currentAccountId();
      this.transactions = id ? this.rowsFor(id) : [];
      this.applyFiltersAndSort();
    });
  }

  // loading values
  loading = input(false);
  loadingRows = Array.from({ length: this.rowsPerPage });
  dataLoading(): boolean {
    return this.loading() || !this.bank.transactionsLoaded();
  }

  private rowsFor(accountId: string): Transaction[] {
    return this.bank.getTransactions(accountId).map((transaction) => {
      const other = transaction.recipientAccountId
        ? this.bank.getAccount(transaction.recipientAccountId)
        : undefined;
      const category =
        transaction.transactionType === TransactionType.Deposit
          ? 'Deposit'
          : transaction.transactionType === TransactionType.Withdraw
            ? 'Withdraw'
            : 'Transfer';
      const status =
        transaction.transactionStatus.charAt(0) +
        transaction.transactionStatus.slice(1).toLowerCase();

      return {
        id: transaction.transactionId,
        date: transaction.dateCreated.toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        category,
        destination: other?.accountName ?? '-',
        status,
        amount: transaction.amount,
        note: transaction.description?.trim() ?? '',
      };
    });
  }

  updateTable(): void {
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.rowsPerPage);

    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;

    this.tableData.set(this.filteredTransactions.slice(startIndex, endIndex));
  }

  applyFiltersAndSort(): void {
    const search = this.searchString.toLowerCase().trim();

    // Start with all transactions
    let results = this.transactions.filter((transaction) => {
      // Search filter
      const matchesSearch =
        transaction.category.toLowerCase().includes(search) ||
        transaction.destination.toLowerCase().includes(search) ||
        transaction.status.toLowerCase().includes(search) ||
        transaction.note.toLowerCase().includes(search) ||
        transaction.amount.toString().includes(search);

      // Category filter
      const matchesCategory =
        this.selectedCategory === '' ||
        transaction.category.toLowerCase() === this.selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    // Sorting
    if (this.orderBy !== '' && this.sortDirection !== '') {
      results.sort((a, b) => {
        let comparison = 0;

        switch (this.orderBy.toLowerCase()) {
          case 'date':
            comparison = a.date.localeCompare(b.date);
            break;

          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;

          case 'destination':
            comparison = a.destination.localeCompare(b.destination);
            break;

          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;

          case 'amount':
            comparison = a.amount - b.amount;
            break;
        }

        return this.sortDirection.toLowerCase() === 'descending' ? -comparison : comparison;
      });
    }

    this.filteredTransactions = results;

    this.currentPage = 1;

    this.updateTable();
  }

  protected processTransaction(type: TransactionType) {
    return this.flow.run(type);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateTable();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateTable();
    }
  }
}
