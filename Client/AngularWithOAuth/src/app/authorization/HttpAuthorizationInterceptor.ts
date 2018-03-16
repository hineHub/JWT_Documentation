import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import { LocalStringStorageService } from '../common/local-string-storage.service';
import { TokenManagerService } from '../common/token.manager.service';
import { JsonWebToken } from './IJson.Web.Token';


@Injectable()
export class HttpAuthorizationInterceptor implements HttpInterceptor {
    
    constructor(private _tokenManagerService : TokenManagerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let authReq = this.addAuthorizationHeader(req);

        //send the request clone
        return next.handle(authReq)
            .do((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse)
                {
                    this.captureRefreshToken(event);
                }
            })
            .catch((error, caught) => {
                //intercept the response error
                console.log("Error Occurred");
                console.log(error);
                //return the error to the method that called it
                return Observable.throw(error);
        }) as any;
    }

    addAuthorizationHeader(authReq: HttpRequest<any>): HttpRequest<any>{        
        if (this.hasExistingToken())
        {
            let token = "bearer " + this._tokenManagerService.getToken().token;
            
            //clone and append authorization
            authReq = authReq.clone({ headers: authReq.headers.set('authorization', token) });
        }

        return authReq;
    }

    captureRefreshToken(response : HttpResponse<any>){
        if (response.headers.has("authorization"))
        {
            let token = response.headers.get("authorization").toString().replace("bearer ", "");
            let jwt = new JsonWebToken(token);
        
            this._tokenManagerService.saveToken(jwt);
            console.log("refresh token saved");
        }
    }


    hasExistingToken() : boolean {
        let token = this._tokenManagerService.getToken();

        return token != null;
    }
}
