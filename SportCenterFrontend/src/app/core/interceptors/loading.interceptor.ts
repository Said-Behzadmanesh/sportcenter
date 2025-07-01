import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class loadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.loading();
    return next.handle(req).pipe(
      delay(1000),
      finalize(() => this.loadingService.idle()));
  }

}
