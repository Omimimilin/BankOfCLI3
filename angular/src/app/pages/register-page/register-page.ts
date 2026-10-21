import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import { BankService } from '../../service/bank';
import { AuthPage } from '../../shared/components/auth-page/auth-page';
import {
  ActionResult,
  AuthCallback,
  AuthFields,
  FormEntries,
} from '../../shared/components/auth/auth';

@Component({
  imports: [AuthPage],
  selector: 'app-register-page',
  styleUrl: './register-page.css',
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private readonly authService = inject(AuthService);

  readonly heading = 'Register Account';
  readonly description =
    'Get started with a new account. Fill in your details below to set up your secure account dashboard.';
  readonly buttonText = 'Register';
  readonly footerText = 'Already have an account?';
  readonly footerActionText = 'Login';
  readonly footerActionLink = '/login';
  readonly fields: AuthFields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'superman',
    },
    {
      name: 'name',
      label: 'Account Nickname',
      type: 'text',
      placeholder: 'Clark Kent',
    },
    {
      name: 'accountPin',
      label: 'Account PIN',
      type: 'password',
      placeholder: '••••',
    },
  ];
  readonly callback: AuthCallback = async (formEntries: FormEntries): ActionResult => {
    const username = String(formEntries['username'] ?? '');
    const name = String(formEntries['name'] ?? '');
    const plainTextPin = String(formEntries['accountPin'] ?? '');
    const result = await this.authService.register({ username, name, plainTextPin });

    if (result.success) {
      return {
        success: true,
        toast: 'Registration successful! You will be redirected to the login page in 3s.',
        redirect: '/login',
      };
    } else {
      return {
        success: false,
        errors: result.errors,
      };
    }
  };
}
