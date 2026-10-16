import { Component, inject } from '@angular/core';
import { BankService } from '../../service/bank';
import { AuthPage } from '../../shared/components/auth-page/auth-page';
import {
  ActionResult,
  AuthCallback,
  AuthFields,
  FormEntries,
} from '../../shared/components/auth/auth';

import { AuthService } from '../../service/auth/auth.service';

@Component({
  imports: [AuthPage],
  selector: 'app-login-page',
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly bank = inject(BankService);
  readonly heading = 'Account Login';
  readonly description =
    'Welcome back! Please enter your login credentials to access your secure account dashboard.';
  readonly buttonText = 'Login';
  readonly footerText = "Don't have an account?";
  readonly footerActionText = 'Register';
  readonly footerActionLink = '/register';
  readonly fields: AuthFields = [
    {
      name: 'accountId',
      label: 'Account ID',
      type: 'text',
    },
    {
      name: 'accountPin',
      label: 'Account PIN',
      type: 'password',
    },
  ];

  readonly callback: AuthCallback = async <T>(formEntries: FormEntries): ActionResult<T> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const accountId = String(formEntries['accountId'] ?? '');
    const accountPin = String(formEntries['accountPin'] ?? '');
    const error = this.bank.login(accountId, accountPin);

    if (error) {
      return {
        success: false,
        errors: [error],
      };
    }

    await this.authService.login({ accountId });

    return {
      success: true,
      redirect: '/dashboard',
    };
  };
}
