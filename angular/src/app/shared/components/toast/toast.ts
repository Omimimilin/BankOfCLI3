import { Component, computed, inject, input } from '@angular/core';
import { twMerge } from 'tailwind-merge';
import { ToastService } from '../../../service/toast';

@Component({
  selector: 'app-toast',
  template: `
    <div [class]="classes()">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-center justify-between gap-2 rounded-xl px-4 py-3 border-2 font-semibold shadow-lg min-w-32"
          [class.border-green-600]="toast.type === 'success'"
          [class.border-red-600]="toast.type === 'error'"
          [class.bg-green-100]="toast.type === 'success'"
          [class.bg-red-100]="toast.type === 'error'"
        >
          <span>{{ toast.message }}</span>
          <button (click)="toastService.dismiss(toast.id)" class="font-bold">✕</button>
        </div>
      }
    </div>
  `,
})
export class ToastContainer {
  toastService = inject(ToastService);
  class = input('');
  classes = computed(() => twMerge('fixed top-4 right-4 z-50 flex flex-col gap-2', this.class()));
}
