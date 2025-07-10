import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../shared/interfaces/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  apiUrl = 'http://localhost:8080/auth';
  redirectUrl: string | null = null;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  login(values: any) {
    return this.http.post<User>(this.apiUrl + '/login', values).pipe(
      map(user => {
        const key = 'token'; // Use a variable to be safe
        localStorage.setItem('token', user.token);
        // console.log(`Token SET with key: "[${key}]"`);
        this.currentUserSource.next(user);
      })
    );
  }

  register(values: any) {
    return this.http.post<User>(this.apiUrl + '/register', values).pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    );
  }

  logout() {
    // const key = 'token'; // Use a variable to be safe
    // console.log(`Attempting to REMOVE token with key: "[${key}]"`);
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  loadUser() {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.get<User>(`${this.apiUrl}/user`, { headers }).subscribe({
        next: user => {
          this.currentUserSource.next(user);
        },
        error: err => {
          console.error("Eror decoding JWT token:", token);
        }
      });
    }
  }
}
