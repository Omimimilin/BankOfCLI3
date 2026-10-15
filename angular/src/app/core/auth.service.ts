import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { tap } from 'rxjs';
import { Api } from "./api";

interface RegisterResponse {
    accountId: string;
}

interface LoginResponse {
    token: string;
}

@Injectable({ providedIn: 'root'})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly api = inject(Api);

    register(pin: string) {
        return this.http.post<RegisterResponse>('${this.api.baseUrl}/auth/register', {pin});
    }

    login(accountId: string, pin: string) {
        return this.http
        .post<LoginResponse>('${this.api.baseUrl}/auth/login', {accountId, pin})
        .pipe(tap((response) => this.api.saveToken(response.token)));
    }

    logout(): void {
        this.api.clearToken();
    }
}