import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import { JwtService } from './api/jwt.service';


@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
    constructor(private _jwtService: JwtService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("intercepted request ... ");

        let authReq = req.clone();

        if (this._jwtService.hasToken)
        {

            authReq = req.clone({ headers: req.headers.set('authorization', this._jwtService.tokenResource) });
            console.log(authReq.headers.get("authorization"));
            console.log("Sending request with new header now ...");
        }
        else
        {
            console.log("no token sent");
        }

        //send the newly created request
        return next.handle(authReq)
            .catch((error, caught) => {
        //intercept the response error and displace it to the console
                console.log("Error Occurred");
                console.log(error);
        //return the error to the method that called it
                return Observable.throw(error);
        }) as any;
    }
}
