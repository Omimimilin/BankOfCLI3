import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { from } from 'rxjs';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private readonly authService = inject(AuthService);

  private readonly isLoggedIn = toSignal(from(this.authService.isLoggedIn()), {
    initialValue: false,
  });

  protected readonly buttonMessage = computed(() =>
    this.isLoggedIn() ? 'Back to Dashboard' : 'Back to Login',
  );
}
