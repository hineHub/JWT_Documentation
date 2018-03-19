import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IJsonWebToken } from '../authorization/IJson.Web.Token';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { ITestApiMethodResponse } from './test.api.method.response';
import { LocalStringStorageService } from '../common/local-string-storage.service';
import { TokenManagerService } from '../common/token.manager.service';

@Injectable()
export class JwtService {
  private _jWTUrl = "https://localhost:44383/api/JWT/";
  private _tokenResource = "token";

  constructor(private _http: HttpClient, private _tokenManagerService : TokenManagerService) {

   }

  createToken(name : string, password: string) : Observable<IJsonWebToken> {
    this._tokenManagerService.removeToken();

    let url = this._jWTUrl + this._tokenResource;

    return this._http.post<IJsonWebToken>(url, {UserName:name,Password:password})
        .do(data => this._tokenManagerService.saveToken(data))
        .catch(this.handleTokenError);
  }

  removeToken(){
    this._tokenManagerService.removeToken();
  }

  callTestMethod() : Observable<ITestApiMethodResponse> {
    let url = this._jWTUrl + "test";

    return this._http.get(url)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse)
  {
      return Observable.throw(err);
  }

  private handleTokenError(err: HttpErrorResponse)
  {
    this._tokenManagerService.removeToken();
    return Observable.throw(err);
  }
}
