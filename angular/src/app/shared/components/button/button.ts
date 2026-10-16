import { Component, computed, input, output } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Component({
  imports: [],
  selector: 'app-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
})
export class Button {
  class = input('');
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
  loading = input(false);
  classes = computed(() => twMerge('', this.class()));
  clicked = output<void>();
}
