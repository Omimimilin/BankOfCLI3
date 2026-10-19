import { Component, computed, input } from '@angular/core';
import { twMerge } from 'tailwind-merge';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { remixCloseFill } from '@ng-icons/remixicon';
import { remixLoader2Fill } from '@ng-icons/remixicon';
import { matCheckCircleOutline } from '@ng-icons/material-symbols/outline';

const statusStyles: Record<string, string> = {
  Rejected: 'border-red-500 bg-red-100 text-red-700',
  Approved: 'border-green-500 bg-green-100 text-green-700',
  Pending: 'border-yellow-500 bg-yellow-100 text-yellow-700',
};

const statusIcons: Record<string, string> = {
  Rejected: 'remixCloseFill',
  Approved: 'matCheckCircleOutline',
  Pending: 'remixLoader2Fill',
};

@Component({
  imports: [NgIcon],
  viewProviders: [provideIcons({ remixCloseFill, remixLoader2Fill, matCheckCircleOutline })],
  selector: 'app-label',
  templateUrl: './label.html',
})
export class Label {
  class = input('');
  status = input.required<string>();
  icon = computed(() => statusIcons[this.status()]);
  classes = computed(() =>
    twMerge(
      'inline-flex items-center gap-x-2 rounded-full border-2 px-3 py-1',
      statusStyles[this.status()],
      this.class(),
    ),
  );
}
