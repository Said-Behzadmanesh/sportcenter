

// export const errorInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { catchError, Observable } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 404) {
          this.toastr.error("404 error happened");
          this.router.navigate(['/not-found']);
        }
        else if (error.status === 500) {
          this.toastr.error("500 error happened");
          this.router.navigate(['/server-error']);
        }
        // passing the error to the next error handling
        throw error;
      })
    );
  }

}
