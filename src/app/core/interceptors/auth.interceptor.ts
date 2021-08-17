import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenService } from 'src/app/shared/services/rest-services/authen.service';
import { prefixReq } from 'src/app/shared/interceptors/http-config';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private sessionService: AuthenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authHeader = this.sessionService.accessToken;
    if(authHeader == null){
      return next.handle(req).pipe(this.handleErrors);
    }
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${authHeader} `, 'Content-Type': 'application/json' },
      //  withCredentials: true,
    });

    console.groupCollapsed(`${prefixReq} 🔑 Auth`);
    console.log(`Adding Auth header`);
    console.groupEnd();
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq).pipe(this.handleErrors);
  }

  handleErrors(source: Observable<HttpEvent<any>>): Observable<HttpEvent<any>> {
    return source.pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("error");
        return error.status === 401 ? this.handle401(error) : throwError(error);
      })
    );
  }

  handle401(error: HttpErrorResponse) {
    console.log("error 401");
    console.log(error);
    const authResHeader = error.headers.get('WWW-Authenticate') || '';
    if (/is expired/.test(authResHeader)) {
      this.router.navigate(['signin']);
      // this.sessionService.refreshToken();
    } else {
      this.router.navigate(['authfailed']);
    }
    return EMPTY;
  }
}
