import { Component, OnInit } from '@angular/core';
import { JwtService } from '../api/json.web.token.service';
import { LoginModel } from '../api/login.model';
import { IJsonWebToken } from '../authorization/IJson.Web.Token';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private _name = "Bill";
  private _password = "Again, not for production use, DEMO ONLY!";
  private _error: string = "";
  private _failedTokenRequest : boolean = false;
  private _hasToken: boolean = false;
  private _model : LoginModel;
  private _token : string;
  private _message: string;
  private _header: string;
  private _payload: string;

  constructor(private _tokenService : JwtService) { 
      this._model = new LoginModel(this._name, this._password);
  }

  ngOnInit(): void {  }
  
  onSubmit(): void  {

    this._tokenService.createToken(this._model.username, this._model.password)
        .subscribe(
            data => { this.onLoginSuccess(data);},
            error => { this.onLoginFailure(error);  }
        );
  }

  getData(): void {
    this._message = "";

    this._tokenService.callTestMethod()
      .subscribe(
          data => {
            this._message = data.message;
          },
          error => {
            this.dealWithError(error);
          }
      );
  }

  private dealWithError(error): void {
    if (error.status == 401)
    {
      this._token = "Expired";
       alert("Please log in");
    }
    else{
        alert("Something has gone wrong")
    }
  }

  private onLoginFailure(error: string){
    this._hasToken = false;
    this._error = error;
    this._failedTokenRequest = true;
  }

  private onLoginSuccess(token: IJsonWebToken): void{
    this._failedTokenRequest = false;
    this._token = token.token;
    this._hasToken = true;

    this.processToken(token.token);
  }

  private processToken(token: string){
    var tokenParts = token.split(".");
    if (tokenParts.length != 3)
    {
        //throw error
    }

    let header = this.b64DecodeUnicode(tokenParts[0]);
    let payload = this.b64DecodeUnicode(tokenParts[1]);

    this._header = JSON.stringify(JSON.parse(header), null, 4);
    this._payload = JSON.stringify(JSON.parse(payload), null, 4);

    this.GetRoles(payload);
  }

  b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  GetRoles(payload: string)
  {
      let payloadElements = payload.split(",");
      let roles = [];

      for (let payloadKeyPair of payloadElements)
      {
        if (payloadKeyPair.indexOf("/identity/claims/role") != -1)
        {
          roles.push(payloadKeyPair.split('"')[3]);
        }
      }

      if (roles.length > 0)
      {
        localStorage.setItem('roles', roles.join(","));
      }

  }



}
