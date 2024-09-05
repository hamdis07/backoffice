import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { HttpClient } from '@angular/common/http';


@Component({


  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
//  providers: [HttpClient], // Added here

  template: `
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'backOffice';
}
