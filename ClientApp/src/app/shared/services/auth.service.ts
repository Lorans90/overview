import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiConfigService, APP_CONFIG, IAppConfig } from 'src/app/core';
import { LoginUser } from '../models/login-user.model';
import { Tokens } from '../models/tokens.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private localStorageKey = 'tokens';

    constructor(
        private httpClient: HttpClient,
        @Inject(APP_CONFIG) private appConfig: IAppConfig,
        private apiConfigService: ApiConfigService,
        private router: Router
    ) { }

    isLoggedIn(): string {
        return localStorage.getItem(this.localStorageKey);
    }

    login(credentials: LoginUser): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpClient.post<Tokens>(`${this.appConfig.apiEndpoint}/${this.apiConfigService.configuration.loginPath}`,
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

    public forceLogout() {
        this.router.navigate(['login'], {
            state: { systemAction: true }
        }).then(navigated => navigated && this.logout());
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
        return this.httpClient
            .post(`${this.appConfig.apiEndpoint}/${this.apiConfigService.configuration.refreshTokenPath}`, { refreshToken })
            .pipe(
                map(response => response || {}),
                tap((response: Tokens) => this.storeToken(response)),
            );
    }
}
