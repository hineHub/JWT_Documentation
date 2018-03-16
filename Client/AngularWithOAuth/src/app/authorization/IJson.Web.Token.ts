export interface IJsonWebToken
{
    token: string;
}

export class JsonWebToken implements IJsonWebToken {
    token: string;

    constructor(token: string){
        this.token = token;
    }
}