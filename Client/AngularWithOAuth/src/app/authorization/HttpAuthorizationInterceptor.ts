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
        console.log(this.getCookie("XSRF-TOKEN"));
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
            let token = this._tokenManagerService.getToken().token;
            authReq = authReq.clone({ headers: authReq.headers.set('authorization', token) });
        }

        return authReq;
    }

    captureRefreshToken(response : HttpResponse<any>){
        console.log(response.headers.keys());
        if (response.headers.has("authorization"))
        {
            let token = response.headers.get("authorization").toString();
            this._tokenManagerService.saveRawToken(token);
        }
    }


    hasExistingToken() : boolean {
        let token = this._tokenManagerService.getToken();

        return token != null;
    }

    getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

}
