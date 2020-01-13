import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map, tap, shareReplay } from 'rxjs/operators';

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface User {
    username: string;
    password: string;
    rememberMe: boolean;
}
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private localStorageKey = 'tokens';

    constructor(private httpClient: HttpClient) { }

    isLoggedIn(): string {
        return localStorage.getItem(this.localStorageKey);
    }

    // public login(user?: User): Observable<Tokens> {
    //     return this.httpClient.post<Tokens>('http://localhost:5000/api/user-account/login', { user });
    // }
    login(credentials: User): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpClient.post<Tokens>('http://localhost:5000/api/v1/Template/Account/Login',
            credentials, { headers });
    }
    public storeToken(tokens: Tokens): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(tokens));
    }

    public clear(): void {
        localStorage.removeItem(this.localStorageKey);
    }

    public logout() {
        this.clear();
    }


    public getTokens(): Tokens {
        const tokensString = localStorage.getItem('tokens') as string;
        let tokens: Tokens;
        if (tokensString) {
            try {
                tokens = JSON.parse(tokensString);
            } catch (error) {
                console.error('Could not parse session info from local-storage.', error);
            }
        }

        return tokens;
    }

    public refreshToken = (): Observable<Tokens> => {
        const refreshToken = this.getTokens().refreshToken;
        return this.httpClient.post('http://localhost:5000/api/v1/Template/Account/RefreshToken', { refreshToken })
            .pipe(
                map(response => response || {}),
                tap((response: Tokens) => this.storeToken(response)),
            );
    }
}
