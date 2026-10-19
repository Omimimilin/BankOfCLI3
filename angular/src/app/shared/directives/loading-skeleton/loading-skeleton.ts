import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appLoadingSkeleton]',
  host: {
    '[class.skeleton-loading]': 'appLoadingSkeleton()',
    '[attr.aria-busy]' : 'appLoadingSkeleton()',
    '[attr.inert]' : 'appLoadingSkeleton() ? "" : null',
  },
})
export class LoadingSkeleton {
  appLoadingSkeleton = input(false);
}
