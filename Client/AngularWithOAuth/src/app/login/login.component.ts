import { Component, OnInit } from '@angular/core';
import { JwtService } from '../api/jwt.service';
import { LoginData } from '../login-data';

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
  private _model : LoginData;
  private _token : string;
  private _message: string;

  constructor(private _tokenService : JwtService) { 
      this._model = new LoginData(this._name, this._password);
  }

  ngOnInit(): void {  }
  
  onSubmit(): void  {

    this._tokenService.postCreds(this._model.username, this._model.password)
        .subscribe(
            data => {
              this._failedTokenRequest = false;
              console.log('This - ' + data.token);
              this._token = data.token;
            },
            error => {
              this._error = error;
              this._failedTokenRequest = true;
            }
        );
  }

  getData(): void {
    this._message = "";

    this._tokenService.getData()
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

  

}
