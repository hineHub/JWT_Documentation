import { Injectable } from '@angular/core';
import { LocalStringStorageService } from "./local-string-storage.service";
import { IJsonWebToken, JsonWebToken } from "../authorization/IJson.Web.Token";
import { IStorageService } from "./Istorage.service";

@Injectable()
export class TokenManagerService
{
    private key = 'JWT_Token';

    constructor(private _localStorageService : LocalStringStorageService) {
        
    }

    getToken(): IJsonWebToken {
        let token : string = this._localStorageService.get(this.key);

        return token != null ? new JsonWebToken(token) : null;
    }    

    saveToken(token : IJsonWebToken): void {
        this._localStorageService.set(this.key, token.token);
    }   

    removeToken()
    {
        if (this.getToken())
        {            
            this._localStorageService.delete(this.key);
        }
    }
}