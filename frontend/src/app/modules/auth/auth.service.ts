import { Injectable } from '@angular/core';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { RequestService } from '../shared/services/request.service';
import { JWT } from '../shared/common/constant';
import { API } from '../shared/common/api';
import { User } from '../../models/user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';

@Injectable()
export class AuthService {
  constructor(private requestService: RequestService) {
  }

  login(email: string, password: string): Observable<any> {
    return this.requestService.post(API.USER.LOGIN, {
      email: email,
      password: password,
    });
  }

  create(user: User): Observable<any> {
    return this.requestService.post(API.USER.CREATE, user);
  }

  hasEmail(email: string): Observable<boolean> {
    return this.requestService.post(API.USER.HAS_EMAIL + `?email=${email}`);
  }

  setToken(token: string) {
    localStorage.setItem(JWT.AUTH, token);
  }

  logout() {
    localStorage.removeItem(JWT.AUTH);
  }

  currentUser(): User {
    if (!this.isAuthenticated()) return null;
    const jwtHelper = new JwtHelper();
    const rawData = jwtHelper.decodeToken(localStorage.getItem(JWT.AUTH));
    return new User(rawData);
  }

  isAuthenticated(): boolean {
    return tokenNotExpired(JWT.AUTH);
  }
}
