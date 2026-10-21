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

  readonly heading = 'Account Login';
  readonly description =
    'Welcome back! Please enter your login credentials to access your secure account dashboard.';
  readonly buttonText = 'Login';
  readonly footerText = "Don't have an account?";
  readonly footerActionText = 'Register';
  readonly footerActionLink = '/register';
  readonly fields: AuthFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
    },
    {
      name: 'accountPin',
      label: 'Account PIN',
      type: 'password',
    },
  ];

  readonly callback: AuthCallback = async (formEntries: FormEntries): ActionResult => {
    const username = String(formEntries['username'] ?? '');
    const plainTextPin = String(formEntries['accountPin'] ?? '');
    const result = await this.authService.login({ username, plainTextPin });

    if (result.success) {
      return {
        success: true,
        redirect: '/dashboard',
      };
    } else {
      return {
        success: false,
        errors: result.errors,
      };
    }
  };
}
