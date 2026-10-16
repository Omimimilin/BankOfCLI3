import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Navbar } from './shared/components/navbar/navbar';
import { BankService } from './service/bank';
import { ThemeService } from './service/theme';

@Component({
  imports: [RouterOutlet, Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Bank-of-CLI-P-2');

  private readonly router = inject(Router);
  private readonly theme = inject(ThemeService);

  // Hide the navbar on the login/register screens
  protected readonly showNavbar = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(
        (e) =>
          !['/login', '/register', '/not-found'].some((p) => e.urlAfterRedirects.startsWith(p)),
      ),
    ),
    { initialValue: false },
  );
}
