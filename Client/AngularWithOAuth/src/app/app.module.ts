import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { MyHttpInterceptor } from './MyHttpInterceptor'
import { AuthService } from './api/auth-service.service';
import { LoginComponent } from './login/login.component'
import { JwtService } from './api/jwt.service';


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
    AuthService,
    { 
        provide: HTTP_INTERCEPTORS, 
        useClass: MyHttpInterceptor, 
        multi: true 
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
