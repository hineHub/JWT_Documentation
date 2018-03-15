import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private httpClient: HttpClient) { }

  method1Call(): void {
    this.httpClient.get("https://jsonplaceholder.typicode.com/users").subscribe(
      success => {
        console.log("Successfully Completed");
        console.log(success);
      }
    );
  }

  method2Call(): void {
    this.httpClient.get("https://localhost:44383/api/JWT/Test").subscribe(
      success => {
        console.log("Successfully Completed");
        console.log(success);
      }
    );
  }
}
