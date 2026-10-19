import { effect, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initial());
  private transitionTimer?: ReturnType<typeof setTimeout>;
  private animateNext = false;

  constructor() {
    // Dark mode itself is the html[data-theme='dark'] rule in styles.css
    effect(() => {
      const root = document.documentElement;
      // Add the fade class in the same step as the theme change so the right animation plays
      if (this.animateNext) {
        this.animateNext = false;
        root.classList.add('theme-transition');
        clearTimeout(this.transitionTimer);
        this.transitionTimer = setTimeout(() => root.classList.remove('theme-transition'), 600);
      }
      root.dataset['theme'] = this.theme();
      try {
        localStorage.setItem('theme', this.theme());
      } catch {}
    });
  }

  toggle(): void {
    this.animateNext = true;
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  // Saved choice first, otherwise follow the OS setting
  private initial(): Theme {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
