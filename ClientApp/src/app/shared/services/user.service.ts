import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { ChangePassword } from '../models/change-password.model';
import { APP_CONFIG, IAppConfig } from '../../core';

@Injectable({
    providedIn: 'root'
})
export class UserService {


    constructor(
        private http: HttpClient,
        @Inject(APP_CONFIG) private appConfig: IAppConfig
    ) { }

    addUser(user: User): Observable<{} | User> {
        return this.http.post<{} | User>(`${this.appConfig.apiEndpoint}/users/${user.id}`, user);
    }

    updateUser(user: User): Observable<{} | User> {
        return this.http.put<{} | User>(`${this.appConfig.apiEndpoint}/users/${user.id}`, user);

    }

    getUser(userId: number): Observable<{} | User> {
        return this.http.get<{} | User>(`${this.appConfig.apiEndpoint}/users/${userId}`);
    }

    changePassword(model: ChangePassword): Observable<any> {
        const url = `${this.appConfig.apiEndpoint}/Password/ChangePassword`;
        return this.http
            .post(url, model)
            .pipe(
                map(response => response || {}),
            );
    }
}
