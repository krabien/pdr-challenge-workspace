import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  // inline template in this extremely simple case for an easier project overview
  template: '<router-outlet></router-outlet>',
  standalone: true,
})
export class App {}
