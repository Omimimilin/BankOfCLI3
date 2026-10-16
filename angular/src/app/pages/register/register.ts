import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule],
    templateUrl: './register.html',
})
export class Register {
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly formBuilder = inject(FormBuilder);

    protected readonly error = signal('');
    protected readonly form = this.formBuilder.nonNullable.group({
        username: ['', Validators.required],
        name: ['', Validators.required],
        pin: ['', Validators.required],
    });

    protected submit(): void {
        if (this.form.invalid) {
            return;
        }

        const { username, name, pin } = this.form.getRawValue();
        this.auth.register(username, name, pin).subscribe({
            next: () => this.router.navigateByUrl('/login'),
            error: () => this.error.set('Registration failed.'),
        });
    }
}