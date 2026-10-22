import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ApiResponse } from '../../models/dto/ApiResponse';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '../../models/dto/auth/AuthDtos';
import { UserResponseDto } from '../../models/dto/user/UserDtos';

@Injectable({
  providedIn: 'root',
})
export abstract class ApiService {
  public readonly http = inject(HttpClient);
  // relative so it works on cloudfront, ng serve proxies it locally (proxy.conf.json)
  public readonly API_BASE = '/api';

  public async handleRequest<T>(
    request$: Observable<ApiResponse<T>>,
    expectedErrorStatuses: number[] = [],
  ): Promise<ApiResponse<T>> {
    try {
      const body = await firstValueFrom(request$);

      if (body.success) {
        return body;
      } else {
        throw new Error("Something went wrong in the server. This shouldn't have happened.");
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (expectedErrorStatuses.includes(error.status)) {
          return error.error;
        } else if (error.status === 0) {
          return {
            success: false,
            errors: ['Unable to connect to the server. Please check if the backend is running.'],
          };
        }
      }

      console.error(error);

      return {
        success: false,
        errors: ['An unexpected error occurred. Please try again.'],
      };
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly http = inject(HttpClient);
  private readonly apiService = inject(ApiService);
  private readonly loginUrl = `${this.apiService.API_BASE}/auth/login`;
  private readonly registerUrl = `${this.apiService.API_BASE}/auth/register`;
  private readonly meUrl = `${this.apiService.API_BASE}/users/me`;
  public readonly ARTIFICIAL_DELAY_MS = 1500;

  public async login(dto: LoginRequestDto): Promise<ApiResponse<LoginResponseDto>> {
    await new Promise((resolve) => setTimeout(resolve, this.ARTIFICIAL_DELAY_MS));
    const request$ = this.http.post<ApiResponse<LoginResponseDto>>(this.loginUrl, dto);
    const response = await this.apiService.handleRequest(request$, [401]);
    if (response.success) {
      localStorage.setItem('jwt', response.data.accessToken);
    }
    return response;
  }

  public async register(dto: RegisterRequestDto): Promise<ApiResponse<RegisterResponseDto>> {
    await new Promise((resolve) => setTimeout(resolve, this.ARTIFICIAL_DELAY_MS));
    const request$ = this.http.post<ApiResponse<RegisterResponseDto>>(this.registerUrl, dto);
    const response = await this.apiService.handleRequest(request$, [400, 409]);
    return response;
  }

  public logout(): void {
    localStorage.removeItem('jwt');
  }

  public async getAccount(): Promise<UserResponseDto | null> {
    const request$ = this.http.get<ApiResponse<UserResponseDto>>(this.meUrl);
    const response = await this.apiService.handleRequest(request$);
    if (response.success) {
      return response.data;
    } else {
      return null;
    }
  }

  public async isLoggedIn(): Promise<boolean> {
    const userDetails = await this.getAccount();
    return !!userDetails;
  }
}
