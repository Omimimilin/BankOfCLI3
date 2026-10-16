import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../service/toast';
import { Button } from '../button/button';
import { Input, InputType } from '../input/input';
import { ToastContainer } from '../toast/toast';

export type AuthFields = { name: string; label: string; type: InputType; placeholder?: string }[];

export type FormEntries = Record<string, FormDataEntryValue>;

export type ActionResult<T = void> = Promise<
  | {
      success: true;
      // data?: T;
      redirect: string;
      toast?: string;
    }
  | {
      success: false;
      errors: string[];
    }
>;

export type AuthCallback = <T>(formEntries: FormEntries) => ActionResult<T>;

@Component({
  imports: [RouterLink, Button, Input, ToastContainer],
  selector: 'app-auth',
  styleUrl: './auth.css',
  templateUrl: './auth.html',
})
export class Auth {
  protected toast = inject(ToastService);
  private toastDurationMs = 3000;

  heading = input.required<string>();
  description = input.required<string>();
  buttonText = input.required<string>();
  footerText = input.required<string>();
  footerActionText = input.required<string>();
  footerActionLink = input.required<string>();
  fields = input.required<AuthFields>();
  callback = input.required<AuthCallback>();

  protected showPassword = signal(false);
  protected isLoading = signal(false);
  protected errorText = signal('');
  protected isFormValid = signal(false);

  constructor(private router: Router) {}

  protected togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  protected async submit(e: SubmitEvent): Promise<void> {
    e.preventDefault();
    this.isLoading.set(true);

    try {
      const formElement = e.currentTarget as HTMLFormElement;
      const formValues: FormEntries = Object.fromEntries(new FormData(formElement).entries());
      const result = await this.callback()<'Generic Here'>(formValues);

      if (!result.success) {
        const errorMessage =
          result.errors.length === 1
            ? result.errors[0]
            : 'The following errors occurred: ' + result.errors.join(', ');
        this.errorText.set(errorMessage);
      } else {
        formElement.reset();
        this.isLoading.set(false);
        this.isFormValid.set(false);
        this.errorText.set('');
        if (result.toast) {
          this.toast.success(result.toast, this.toastDurationMs);
          await new Promise((resolve) => setTimeout(resolve, this.toastDurationMs));
        }
        this.router.navigate([result.redirect]);
      }
    } catch (err) {
      this.errorText.set('An unexpected error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
