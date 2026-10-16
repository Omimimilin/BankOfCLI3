import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Button } from '../../shared/components/button/button';
import { Card } from '../../shared/components/card/card';
import { TransactionTable } from './transaction-table/transaction-table';

import { TitleCasePipe } from '@angular/common';

import Chart from 'chart.js/auto';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { matMoneyBagFillOutline, matSavingsFillOutline } from '@ng-icons/material-symbols/outline';
import { matAddCircleRound } from '@ng-icons/material-symbols/round';
import { Transaction } from '../../models/Transaction.model';
import { TransactionStatus } from '../../models/TransactionStatus.model';
import { TransactionType } from '../../models/TransactionType.model';
import { BankService } from '../../service/bank';
import { TransactionFlow } from '../../service/transaction-flow';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    TransactionTable,
    Button,
    Card,
    DatePipe,
    NgIcon,
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
    TitleCasePipe,
  ],
  providers: [
    provideIcons({
      matMoneyBagFillOutline,
      matSavingsFillOutline,
      matAddCircleRound,
    }),
  ],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
  host: { '(document:keydown.enter)': 'stopLoading()' },
})
export class Dashboard implements AfterViewInit {
  private readonly bank = inject(BankService);
  private readonly flow = inject(TransactionFlow);
  protected readonly types = TransactionType;
  private chart?: Chart;

  // Tried in order; the CDK uses the first one that fits on screen
  menuPositions: ConnectedPosition[] = [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -8 },
  ];
  protected readonly accountsLoaded = this.bank.accountsLoaded;
  protected readonly transactionsLoaded = this.bank.transactionsLoaded;
  cardNumber = '4827 1938 6274 9183';
  expirationDate = '08/30';
  currentDate = new Date();

  protected readonly account = computed(() => {
    this.bank.revision();
    if (!this.accountsLoaded()) return undefined;
    const id = this.bank.currentAccountId();
    return id ? this.bank.getAccount(id) : undefined;
  });

  protected readonly monthSummary = computed(() => {
    const current = this.monthTotals(0);
    const previous = this.monthTotals(-1);
    const income = this.changeLabel(current.income, previous.income);
    const spending = this.changeLabel(current.spending, previous.spending);
    return {
      income: this.money(current.income),
      spending: this.money(current.spending),
      incomeChange: income.text,
      spendingChange: spending.text,
      incomeDirection: income.direction,
      spendingDirection: spending.direction,
    };
  });

  protected readonly balanceHistory = computed(() => {
    const labels = this.getLastFiveMonths();
    const transactions = this.approvedTransactions();
    const values = labels.map((_, index) => {
      const end = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - (labels.length - 1 - index) + 1,
        0,
        23,
        59,
        59,
        999,
      ).getTime();
      const balance = transactions.reduce(
        (total, transaction) =>
          transaction.dateCreated.getTime() <= end ? total + this.signedAmount(transaction) : total,
        0,
      );
      return Math.round(balance * 100) / 100;
    });
    return { labels, values };
  });

  // Deliberate 10s loading state; Enter skips it. Still waits on real data.
  private readonly delayActive = signal(true);
  private loadingTimer?: ReturnType<typeof setTimeout>;
  protected readonly isLoading = computed(
    () => this.delayActive() || !this.accountsLoaded() || !this.transactionsLoaded(),
  );

  stopLoading(): void {
    clearTimeout(this.loadingTimer);
    this.delayActive.set(false);
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.chart?.destroy();
      clearTimeout(this.loadingTimer);
    });
    effect(() => {
      const history = this.balanceHistory();
      if (!this.chart) return;
      this.applyHistory(history);
    });

    this.loadingTimer = setTimeout(() => this.stopLoading(), 60000);
  }

  ngAfterViewInit(): void {
    const history = this.balanceHistory();
    const yAxis = this.getYAxisRange(history.values);
    Chart.getChart('balanceChart')?.destroy();

    this.chart = new Chart('balanceChart', {
      type: 'line',

      data: {
        labels: history.labels,

        datasets: [
          {
            label: 'Balance',
            data: history.values,
            borderColor: '#232323',
            borderWidth: 1,
            tension: 0,
            fill: false,

            pointRadius: 7,

            // Creates the visual gap around the dot
            pointBorderWidth: 4,
            pointBorderColor: 'white',

            // Actual dot
            pointBackgroundColor: '#C3A9E9',
            pointHoverRadius: 7,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          y: {
            min: yAxis.min,
            max: yAxis.max,

            ticks: {
              stepSize: yAxis.step,

              callback: function (value) {
                const amount = Number(value);

                if (amount >= 1000) {
                  return '$' + amount / 1000 + 'k';
                }

                return '$' + amount;
              },
            },
          },
        },
      },
    });
  }

  protected processTransaction(type: TransactionType) {
    return this.flow.run(type);
  }

  getLastFiveMonths(): string[] {
    const months: string[] = [];

    for (let i = 4; i >= 0; i--) {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - i, 1);

      months.push(date.toLocaleString('en-US', { month: 'short' }));
    }

    return months;
  }

  private approvedTransactions(): Transaction[] {
    this.bank.revision();
    const id = this.bank.currentAccountId();
    if (!this.transactionsLoaded() || !id) return [];
    return this.bank
      .getTransactions(id)
      .filter((transaction) => transaction.transactionStatus === TransactionStatus.Approved);
  }

  private monthTotals(offset: number): { income: number; spending: number } {
    const start = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + offset,
      1,
    ).getTime();
    const end = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + offset + 1,
      0,
      23,
      59,
      59,
      999,
    ).getTime();
    let income = 0;
    let spending = 0;
    for (const transaction of this.approvedTransactions()) {
      const time = transaction.dateCreated.getTime();
      if (time < start || time > end) continue;
      if (this.signedAmount(transaction) >= 0) income += transaction.amount;
      else spending += transaction.amount;
    }
    return { income, spending };
  }

  private signedAmount(transaction: Transaction): number {
    return transaction.transactionType === TransactionType.Deposit ||
      transaction.transactionType === TransactionType.TransferIn
      ? transaction.amount
      : -transaction.amount;
  }

  private money(amount: number): string {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  private changeLabel(
    current: number,
    previous: number,
  ): { text: string; direction: 'up' | 'down' | 'flat' } {
    if (previous === 0) {
      return current === 0 ? { text: '0%', direction: 'flat' } : { text: '—', direction: 'flat' };
    }
    const percent = Math.round(((current - previous) / previous) * 100);
    if (percent > 0) return { text: `↑ ${percent}%`, direction: 'up' };
    if (percent < 0) return { text: `↓ ${Math.abs(percent)}%`, direction: 'down' };
    return { text: '0%', direction: 'flat' };
  }

  private applyHistory(history: { labels: string[]; values: number[] }): void {
    if (!this.chart) return;
    const yAxis = this.getYAxisRange(history.values);
    this.chart.data.labels = history.labels;
    this.chart.data.datasets[0].data = history.values;
    const scale = this.chart.options.scales?.['y'] as
      { min?: number; max?: number; ticks?: { stepSize?: number } } | undefined;
    if (scale) {
      scale.min = yAxis.min;
      scale.max = yAxis.max;
      if (scale.ticks) scale.ticks.stepSize = yAxis.step;
    }
    this.chart.update();
  }

  private getYAxisRange(values: number[]) {
    let minData = Math.min(...values);
    let maxData = Math.max(...values);

    if (minData === maxData) {
      const pad = minData === 0 ? 1000 : Math.max(Math.abs(minData) * 0.2, 1000);
      if (minData > 0) minData = Math.max(0, minData - pad);
      else minData -= pad;
      maxData += pad;
    }

    // Round outward to the nearest $1,000
    const min = Math.floor(minData / 1000) * 1000;
    let max = Math.ceil(maxData / 1000) * 1000;
    if (max === min) max = min + 1000;

    // 5 ticks means 4 equal spaces
    const step = (max - min) / 4;

    return {
      min,
      max,
      step,
    };
  }
}
