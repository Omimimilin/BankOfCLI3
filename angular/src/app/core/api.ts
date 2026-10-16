import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root'})
export class Api {
    readonly baseUrl = 'http://localhost:8080';
    private readonly tokenKey = 'jwt';

    token(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    saveToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    clearToken(): void {
        localStorage.removeItem(this.tokenKey);
    }
}