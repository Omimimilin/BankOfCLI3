import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLogOut, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { AuthService } from '../../../service/auth/auth.service';
import { TransactionType } from '../../../models/TransactionType.model';
import { BankService } from '../../../service/bank';
import { ThemeService } from '../../../service/theme';
import { TransactionFlow } from '../../../service/transaction-flow';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Logo, NgIcon],
  viewProviders: [provideIcons({ lucideLogOut, lucideMoon, lucideSun })],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly bank = inject(BankService);
  protected readonly theme = inject(ThemeService);
  constructor(private router: Router) {}

  private readonly flow = inject(TransactionFlow);

  protected readonly transactionLinks = [
    { type: TransactionType.Deposit, label: 'Deposit' },
    { type: TransactionType.Withdraw, label: 'Withdraw' },
    { type: TransactionType.TransferOut, label: 'Transfer' },
  ];

  protected transact(type: TransactionType): void {
    this.closeMenu();
    this.flow.run(type);
  }

  protected readonly menuOpen = signal(false);

  private hovering = false;

  protected onPointerEnter(event: PointerEvent): void {
    if (event.pointerType === 'mouse') {
      this.hovering = true;
      this.menuOpen.set(true);
    }
  }

  protected onPointerLeave(event: PointerEvent): void {
    if (event.pointerType === 'mouse') {
      this.hovering = false;
      this.closeMenu();
    }
  }

  protected toggleMenu(): void {
    if (!this.hovering) {
      this.menuOpen.update((open) => !open);
    }
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!(event.currentTarget as HTMLElement).contains(next)) {
      this.closeMenu();
    }
  }

  protected logout() {
    this.authService.logout();
    this.bank.logout();
    this.router.navigate(['/login']);
  }
}
