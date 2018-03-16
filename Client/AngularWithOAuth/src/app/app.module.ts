import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpAuthorizationInterceptor } from './authorization/HttpAuthorizationInterceptor'
import { LoginComponent } from './login/login.component'
import { JwtService } from './api/json.web.token.service';
import { LocalStringStorageService } from './common/local-string-storage.service';
import { TokenManagerService } from './common/token.manager.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    HttpClientModule,
    JwtService,
    TokenManagerService,
    LocalStringStorageService,
    { 
        provide: HTTP_INTERCEPTORS, 
        useClass: HttpAuthorizationInterceptor, 
        multi: true 
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
