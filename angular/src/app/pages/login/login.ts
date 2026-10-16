import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.html',
})
export class Login {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly formBuilder = inject(FormBuilder);

    protected readonly error = signal('');
    protected readonly form = this.formBuilder.nonNullable.group({
        username: ['', Validators.required],
        pin: ['', Validators.required],
    });

    protected submit(): void {
        if (this.form.invalid) {
            return;
        }
        const { username, pin } = this.form.getRawValue();
        this.auth.login(username, pin).subscribe({
            next: () => this.router.navigateByUrl('/dashboard'),
            error: () => this.error.set('Login failed.'),
        });
    }
}