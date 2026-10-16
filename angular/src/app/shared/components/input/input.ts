import { Component, computed, input, model, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { matSearchOutline } from '@ng-icons/material-symbols/outline';
import { twMerge } from 'tailwind-merge';

export type InputType = 'text' | 'password' | 'search' | 'number';

@Component({
  imports: [NgIcon],
  selector: 'app-input',
  viewProviders: [provideIcons({ lucideEye, lucideEyeOff, matSearchOutline })],
  styleUrl: './input.css',
  templateUrl: './input.html',
})
export class Input {
  class = input('');
  type = input<InputType>('text');
  placeholder = input<string | undefined>('');
  inputId = input.required<string>();
  name = input('');
  value = model('');
  disabled = input(false);

  protected showPassword = signal(false);

  protected classes = computed(() => twMerge(this.icon() ? 'pr-11' : '', this.class()));

  protected inputType = computed(() =>
    this.type() === 'password' && this.showPassword() ? 'text' : this.type(),
  );

  protected icon = computed(() => {
    switch (this.type()) {
      case 'password':
        return this.showPassword() ? 'lucideEyeOff' : 'lucideEye';
      case 'search':
        return 'matSearchOutline';
      default:
        return null;
    }
  });

  protected togglePassword(): void {
    this.showPassword.update((shown) => !shown);
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
