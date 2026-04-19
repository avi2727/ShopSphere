import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,         // required if not declaring in NgModule
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,  // <- this renders Login/Dashboard
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('client');
}