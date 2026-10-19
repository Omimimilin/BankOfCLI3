import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs/operators';

import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = 'a-super-secret-key-that-is-at-least-256-bits-long';
const secretKey = new TextEncoder().encode(SECRET_KEY);

type ValidAuth<T> = { isValid: true; payload: T };
type ErrorAuth = { isValid: false; errors: string[] };
type AuthResult<T> = Promise<ValidAuth<T> | ErrorAuth>;

type JwtPayload = {
  accountId: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private http = inject(HttpClient);
  // private apiUrl = 'https://api.yourdomain.com/auth';

  private createToken = async (payload: JwtPayload) =>
    await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(secretKey);

  private async verifyToken(token: string): AuthResult<JwtPayload> {
    try {
      const { payload }: { payload: JwtPayload } = await jwtVerify(token, secretKey, {
        algorithms: ['HS256'],
      });
      return { isValid: true, payload };
    } catch (error) {
      // If expired, signature is invalid, or malformed
      return { isValid: false, errors: [(error as Error).message] };
    }
  }

  public async login(credentials: JwtPayload): Promise<void> {
    // return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
    //   tap(response => {
    //     // Save the JWT in localStorage (or sessionStorage)
    //     localStorage.setItem('jwt', response.token);
    //   })
    // );

    const token = await this.createToken(credentials);
    localStorage.setItem('jwt', token);
  }

  public logout(): void {
    localStorage.removeItem('jwt');
  }

  public async getCurrentUser(): Promise<AuthResult<JwtPayload>> {
    const token = localStorage.getItem('jwt') ?? '';
    return this.verifyToken(token);
  }

  public async isLoggedIn(): Promise<boolean> {
    const currentUser = await this.getCurrentUser();
    return currentUser.isValid;
  }
}
