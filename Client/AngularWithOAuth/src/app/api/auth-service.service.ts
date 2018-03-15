import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }
  _accessToken: string = "";
  _refreshToken: string = "";
  BASE_URL : string = "";
  TokenEndpoint: string = "";

  get accessToken(): string {
    return this._accessToken;
  }
  set accessToken(value: string) {
      this._accessToken = value;
  }

  refreshToken(): Observable<string> {
    let refreshAuth = this.getRefreshToken(); //get refresh token from storage
    let url: string = this.BASE_URL + this.TokenEndpoint;
    return this.http.get(url, {
      headers: new HttpHeaders().set('refreshAuthorization', refreshAuth),
      observe: 'response'
    }).map(refreshResponse => {
      let authToken: string = refreshResponse.headers.get('authorizationToken');
      let refreshToken: string = refreshResponse.headers.get('refreshToken');
      //add token to storage
      this.createToken(authToken, refreshToken); // method for adding token to cookie storage
      return authToken; //return the new authorization token
    });
  }

  removeToken(): void
  {
    //delete the cookie
  }

  createToken(authToken: string, refreshToken: string): void {
    //create the full token as a cookie
  }

  getRefreshToken(): string{
      return ""; // get this from the cookie
  }


}
