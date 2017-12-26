import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '../shared/common/constant';
import { User } from '../../models/user';
import { API } from '../shared/common/api';
import { Observable } from 'rxjs/Observable';
import { Role } from '../../models/role';

@Injectable()
export class AuthService {
  role = Role;

  constructor(private httpClient: HttpClient,
              private router: Router,
              private jwtHelperService: JwtHelperService) {
  }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post(API.USER.LOGIN, {
      email: email,
      password: password,
    });
  }

  register(user: User): Observable<any> {
    return this.httpClient.post(API.USER.REGISTER, user);
  }

  isExistEmail(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(API.USER.EXIST_EMAIL + `?email=${email}`, {});
  }

  forgot(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${API.USER.URL}/forgot?email=${email}`, {});
  }

  setToken(token: string) {
    localStorage.setItem(Storage.AUTH, token);
  }

  logout() {
    localStorage.removeItem(Storage.AUTH);
  }

  currentUser(): User {
    if (!this.isAuthenticated()) return null;
    const rawData = this.jwtHelperService.decodeToken(localStorage.getItem(Storage.AUTH));
    return new User(rawData);
  }

  isAdmin(): boolean {
    return this.currentUser().role === this.role.Administrator;
  }

  isModerator(): boolean {
    return this.currentUser().role === this.role.Moderator;
  }

  isNone(): boolean {
    return this.currentUser().role === this.role.None;
  }

  isAuthenticated(): boolean {
    const token = this.jwtHelperService.tokenGetter();

    return token != null && !this.jwtHelperService.isTokenExpired(token);
  }

  checkLogin() {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login'],
        {queryParams: {returnUrl: this.router.routerState.snapshot.url}});
      return;
    }
  }
}
