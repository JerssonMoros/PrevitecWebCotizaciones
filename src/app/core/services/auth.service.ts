// import { Injectable, signal, computed } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, of, tap, catchError } from 'rxjs';
// import { User, AuthResponse, LoginRequest } from '../../models/user.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private readonly TOKEN_KEY = 'auth_token';

//   // State management with signals
//   private _currentUser = signal<User | null>(null);
//   private _isAuthenticated = signal<boolean>(false);

//   // Computed signals
//   currentUser = computed(() => this._currentUser());
//   isAuthenticated = computed(() => this._isAuthenticated());

//   constructor(private http: HttpClient) {
//     this.loadUserFromStorage();
//   }

//   login(credentials: LoginRequest): Observable<AuthResponse> {
//     // TODO: Replace with actual API call
//     return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
//       tap(response => {
//         this.setSession(response);
//       }),
//       catchError(() => {
//         // Mock response for development
//         const mockResponse: AuthResponse = {
//           user: {
//             id: '1',
//             email: credentials.email,
//             name: 'Mock User',
//             role: 'user',
//             isAuthenticated: true
//           },
//           token: 'mock-jwt-token'
//         };
//         this.setSession(mockResponse);
//         return of(mockResponse);
//       })
//     );
//   }

//   logout(): void {
//     this.clearSession();
//   }

//   register(userData: any): Observable<AuthResponse> {
//     // TODO: Implement registration
//     return this.http.post<AuthResponse>('/api/auth/register', userData);
//   }

//   refreshToken(): Observable<AuthResponse> {
//     // TODO: Implement token refresh
//     return this.http.post<AuthResponse>('/api/auth/refresh', {});
//   }

//   private setSession(authResponse: AuthResponse): void {
//     localStorage.setItem(this.TOKEN_KEY, authResponse.token);
//     this._currentUser.set(authResponse.user);
//     this._isAuthenticated.set(true);
//   }

//   private clearSession(): void {
//     localStorage.removeItem(this.TOKEN_KEY);
//     this._currentUser.set(null);
//     this._isAuthenticated.set(false);
//   }

//   private loadUserFromStorage(): void {
//     const token = localStorage.getItem(this.TOKEN_KEY);
//     if (token) {
//       // TODO: Validate token with backend and load user
//       // For now, set a mock authenticated state
//       this._isAuthenticated.set(true);
//     }
//   }

//   getToken(): string | null {
//     return localStorage.getItem(this.TOKEN_KEY);
//   }
// }