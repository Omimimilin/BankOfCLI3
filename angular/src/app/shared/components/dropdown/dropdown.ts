import { Component, computed, input, model } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-dropdown',
  styleUrl: './dropdown.css',
  templateUrl: './dropdown.html',
})
export class Dropdown {
  class = input('');
  classes = computed(() => twMerge('', this.class()));
  options = input<string[]>([]);
  placeHolder = input('Select');
  value = model('');
  disabled = input(false);
}
