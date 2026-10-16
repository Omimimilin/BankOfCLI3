import { Component, computed, input } from '@angular/core';
import { twMerge } from 'tailwind-merge';
import { LoadingSkeleton } from '../../directives/loading-skeleton/loading-skeleton';

@Component({
  selector: 'app-card',
  imports: [LoadingSkeleton],
  templateUrl: './card.html',
  // host: { '[class]': 'classes()' },
})
export class Card {
  class = input('');
  loading = input(false);
  classes = computed(() =>
    twMerge('border-1 border-gray-200 p-4 rounded-xl w-full bg-white', this.class()),
  );
}
