
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <router-outlet></router-outlet>

    <!-- Development Navigation Helper -->
    <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      @if (showDevMenu()) {
        <div class="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-2 mb-4 border border-slate-200 dark:border-slate-700 flex flex-col gap-2 min-w-[200px] animate-fade-in-up">
          <div class="text-xs font-bold text-slate-500 uppercase px-2 py-1">Navegación Rápida</div>
          <a routerLink="/" (click)="toggleDevMenu()" class="px-3 py-2 text-sm hover:bg-purple-50 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer">
            Portal de Validación
          </a>
          <a routerLink="/admin/catalog" (click)="toggleDevMenu()" class="px-3 py-2 text-sm hover:bg-purple-50 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer">
            Admin: Catálogo
          </a>
          <a routerLink="/admin/issue" (click)="toggleDevMenu()" class="px-3 py-2 text-sm hover:bg-purple-50 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer">
            Admin: Emisión Masiva
          </a>
          <a routerLink="/student" (click)="toggleDevMenu()" class="px-3 py-2 text-sm hover:bg-purple-50 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer">
            Panel Estudiante
          </a>
        </div>
      }
      
      <button (click)="toggleDevMenu()" class="bg-admin-primary hover:bg-primary-dark text-white rounded-full p-3 shadow-lg transition-transform hover:scale-110">
        <span class="material-icons">map</span>
      </button>
    </div>
  `
})
export class AppComponent {
  showDevMenu = signal(false);

  toggleDevMenu() {
    this.showDevMenu.update(v => !v);
  }
}
