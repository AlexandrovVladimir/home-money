import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {User} from '../models/user.model';
import {catchError} from 'rxjs/operators';
import {BaseApi} from '../core/base-api';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /* так как добавили базовый класс base-api , то перепишем метод getUserByEmail и класс UserService */
  constructor (private http: HttpClient) {}

  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + `/users?email=${email}`);
  }

  createNewUser(user: User): Observable<User> {
    return this.http.post<User>(environment.apiUrl + '/users', user);
  }
}
