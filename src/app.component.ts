
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html'
})
export class AppComponent {
  showDevMenu = signal(false);

  toggleDevMenu() {
    this.showDevMenu.update(v => !v);
  }
}
