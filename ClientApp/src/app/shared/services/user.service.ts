import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import { ChangePassword } from '../models/change-password.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {


    constructor(private http: HttpClient) { }

    addUser(user: User): Observable<{} | User> {
        return this.http.post<{} | User>(`http://localhost:5000/api/v1/Template/users/${user.id}`, user);
    }

    updateUser(user: User): Observable<{} | User> {
        return this.http.put<{} | User>(`http://localhost:5000/api/v1/Template/users/${user.id}`, user);

    }

    getUser(userId: number): Observable<{} | User> {
        return this.http.get<{} | User>(`http://localhost:5000/api/v1/Template/users/${userId}`);
    }

    changePassword(model: ChangePassword): Observable<any> {
        const url = `http://localhost:5000/api/v1/Template/Password/ChangePassword`;
        return this.http
            .post(url, model)
            .pipe(
                map(response => response || {}),
            );
    }
}
