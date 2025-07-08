// src/app/core/interceptors/jwt.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../../account/account.service';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token: string | undefined;

    // We use take(1) because we only want the current value of the user, not a continuous stream
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      token = user?.token;
    });

    if (token) {
      // If we have a token, clone the request and add the authorization header
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Pass the (possibly modified) request on to the next handler
    return next.handle(request);
  }
}
