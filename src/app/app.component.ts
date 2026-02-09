import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StorageService } from './services/storage.service';
import { ToastService } from './services/toast.service';
import { ToastComponent } from './components/toast.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <router-outlet></router-outlet>
      <app-toast></app-toast>
      
      <!-- Theme Toggle Floating Button -->
      <button 
        (click)="toggleTheme()"
        class="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:scale-110 transition-transform duration-200"
        title="Cambiar tema">
        <span class="material-icons text-amber-500 dark:text-slate-400 text-xl">
          {{ isDarkMode() ? 'dark_mode' : 'light_mode' }}
        </span>
      </button>
    </div>
  `
})
export class AppComponent {
  isDarkMode = this.storageService.isDarkMode;

  constructor(
    private storageService: StorageService,
    private toastService: ToastService
  ) {}

  toggleTheme(): void {
    this.storageService.toggleTheme();
    this.toastService.info(this.isDarkMode() ? 'Modo oscuro activado' : 'Modo claro activado', 2000);
  }
}
