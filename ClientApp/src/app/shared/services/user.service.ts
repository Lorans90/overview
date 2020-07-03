import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_CONFIG, IAppConfig } from '../../core';
import { ChangePassword } from '../models/change-password.model';
import { User } from '../models/user.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};
@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(
        private http: HttpClient,
        @Inject(APP_CONFIG) private appConfig: IAppConfig
    ) { }

    getUsers() {
        return this.http.get<User[]>(`${this.appConfig.apiEndpoint}/Users/GetUsers`);
    }
    addUser(user: User): Observable<User> {
        return this.http.post<User>(`${this.appConfig.apiEndpoint}/Users`, user);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put<User>(`${this.appConfig.apiEndpoint}/users/${user.id}`, user);

    }

    getUser(userId: number): Observable<User> {
        return this.http.get<User>(`${this.appConfig.apiEndpoint}/users/${userId}`);
    }

    getRoles() {
        return this.http.get<User>(`${this.appConfig.apiEndpoint}/Users/GetRoles`);
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
