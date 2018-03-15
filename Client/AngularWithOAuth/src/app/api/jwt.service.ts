import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IJWTToken } from '../Token';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { ITestResponse } from './testResponse';

@Injectable()
export class JwtService {
  private _jWTUrl = "https://localhost:44383/api/JWT/";
    private _tokenResource = "token";
  private _token : string = "";
  private _hasToken: boolean = false;

  get tokenResource(): string {
    return "bearer " + this._token;
  }

  get hasToken(): boolean {
    return this._hasToken;
  }

  constructor(private _http: HttpClient) { }

  postCreds(name : string, password: string) : Observable<IJWTToken> {
    let url = this._jWTUrl + this._tokenResource;

    return this._http.post<IJWTToken>(url, {UserName:name,Password:password})
        .do(data => {
          this._token = data.token;
          this._hasToken = true;
        })
        .catch(this.handleTokenError);
  }

  getData() : Observable<ITestResponse> {
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
      this._hasToken = false;

      return Observable.throw(err);
  }
}
