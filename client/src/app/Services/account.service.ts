import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../Models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  // the reson we set this up as an observable
  // is so that can observed by other components or other classes in the application
  // and whenever something subscribes to this
  // then it's going to be notified if anything changes
  // this the reason for using this observable
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private presence: PresenceService) { }

  login(model: any) {
    return this.http.post(`${this.baseUrl}account/login`, model).pipe(
      map((res: User) => {
        const user = res;
        if(user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post(`${this.baseUrl}account/register`, model).pipe(
      map((res: User) => {
        const user = res;
        if(user) {
          this.setCurrentUser(user);
          this.presence.createHubConnection(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user: any) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presence.stopHubConnection()
  }

  getDecodedToken(token) {
    return JSON.parse(atob(token.split('.')[1]));
  }

}
