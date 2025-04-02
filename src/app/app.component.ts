import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main>
      <router-outlet />
      <footer class="h-14 bg-black"></footer>
    </main>
  `,
  styles: ``,
})
export class AppComponent {}
