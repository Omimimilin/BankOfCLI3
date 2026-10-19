import { Component, input } from '@angular/core';
import { Auth, AuthCallback, AuthFields } from '../auth/auth';
import { Logo } from '../logo/logo';

@Component({
  imports: [Auth, Logo],
  selector: 'app-auth-page',
  styleUrl: './auth-page.css',
  templateUrl: './auth-page.html',
})
export class AuthPage {
  heading = input.required<string>();
  description = input.required<string>();
  buttonText = input.required<string>();
  footerText = input.required<string>();
  footerActionText = input.required<string>();
  footerActionLink = input.required<string>();
  fields = input.required<AuthFields>();
  callback = input.required<AuthCallback>();
}
