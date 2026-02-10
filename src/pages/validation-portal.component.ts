import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../app/components/header.component';

@Component({
  selector: 'app-validation-portal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="font-display min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <!-- Header compartido con selector de rol -->
      <app-header 
        [userName]="'Ángel David'"
        [userRole]="currentRole()"
        [showRoleSelector]="true"
        (roleChange)="onRoleChange($event)"
        (logout)="onLogout()">
      </app-header>

      <!-- Main Content -->
      <main class="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
        <!-- Logo UIFCE Grande -->
        <div class="mb-8 text-center">
          <div class="inline-flex flex-col items-center">
            <span class="text-6xl md:text-7xl font-bold tracking-tighter text-admin-primary dark:text-purple-400">UIFCE</span>
            <span class="text-sm md:text-base uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 mt-2 font-medium">Unidad Informática de la Facultad de Ciencias Económicas</span>
            <div class="w-24 h-1 bg-admin-primary mt-4"></div>
          </div>
        </div>

        <div class="w-full max-w-2xl bg-white dark:bg-surface-dark rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
          <div class="p-8 pb-4 text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-admin-primary/10 dark:bg-admin-primary/20 text-admin-primary dark:text-purple-400 mb-6">
              <span class="material-icons-outlined text-5xl">workspace_premium</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Verificación de Insignias
            </h1>
            <p class="text-gray-500 dark:text-gray-400 text-base">
              Portal oficial de validación de certificaciones digitales
            </p>
          </div>

          <div class="px-8 pb-8">
            <div class="relative">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" for="hash-code">
                Código Único de Validación
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-icons-outlined text-gray-400 text-xl">vpn_key</span>
                </div>
                <input 
                  [(ngModel)]="searchHash"
                  class="block w-full pl-12 pr-36 py-4 text-base bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-admin-primary dark:text-white placeholder-gray-400 outline-none" 
                  id="hash-code" 
                  placeholder="Ingrese el código de verificación" 
                  type="text"/>
                <button (click)="search()" class="absolute right-2 top-2 bottom-2 bg-admin-primary hover:bg-purple-800 text-white font-semibold px-6 rounded-md">
                  Verificar
                </button>
              </div>
              <p class="mt-2 text-xs text-gray-400">Ejemplo: a1b2-c3d4-e5f6-g7h8</p>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-slate-900/50 px-8 py-5 border-t border-gray-100 dark:border-slate-700">
            <p class="text-xs text-center text-gray-400 mb-4 uppercase tracking-wider font-medium">Algunas de nuestras insignias son:</p>
            <div class="flex justify-center items-center space-x-8 md:space-x-12">
              <div class="flex items-center space-x-2" title="R Language">
                <span class="font-serif font-bold text-2xl text-gray-500 dark:text-gray-400">R</span>
              </div>
              <div class="flex items-center space-x-2" title="PostgreSQL">
                <span class="material-icons-outlined text-gray-500 dark:text-gray-400 text-2xl">storage</span>
                <span class="font-semibold text-gray-500 dark:text-gray-400 hidden sm:block">PostgreSQL</span>
              </div>
              <div class="flex items-center space-x-2" title="PowerBI">
                <span class="material-icons-outlined text-gray-500 dark:text-gray-400 text-2xl">bar_chart</span>
                <span class="font-semibold text-gray-500 dark:text-gray-400 hidden sm:block">PowerBI</span>
              </div>
              <div class="flex items-center space-x-2" title="Python">
                <span class="material-icons-outlined text-gray-500 dark:text-gray-400 text-2xl">code</span>
                <span class="font-semibold text-gray-500 dark:text-gray-400 hidden sm:block">Python</span>
              </div>
            </div>
          </div>
        </div>

        @if (foundBadge()) {
          <div class="w-full max-w-2xl mt-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border-l-4 border-green-500">
            <div class="p-6">
              <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
                 <div class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <span class="material-icons text-3xl text-green-600 dark:text-green-400">workspace_premium</span>
                 </div>
                 <div class="flex-grow">
                    <div class="flex items-center gap-2 mb-2">
                      <h3 class="text-xl font-bold text-gray-800 dark:text-white">{{ foundBadge().name }}</h3>
                      <span class="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded font-semibold uppercase tracking-wide">Válido</span>
                    </div>
                    <div class="space-y-1 text-sm">
                      <p class="text-gray-600 dark:text-gray-300">Conferido a: <span class="font-semibold text-gray-900 dark:text-white">{{ foundBadge().student }}</span></p>
                      <p class="text-gray-500 dark:text-gray-400">Fecha de emisión: <span class="font-mono">{{ foundBadge().date }}</span></p>
                      <p class="text-gray-500 italic mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">{{ foundBadge().course }}</p>
                    </div>
                 </div>
                 <div class="shrink-0">
                    <button class="flex items-center space-x-2 text-admin-primary hover:text-purple-800 font-medium text-sm bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded">
                      <span class="material-icons">download</span>
                      <span>Certificado</span>
                    </button>
                 </div>
              </div>
            </div>
          </div>
        }

        <div class="mt-8 text-center">
          <a routerLink="/student" class="text-admin-primary hover:text-purple-800 text-sm font-medium">¿Eres estudiante? Ingresa a tu panel aquí</a>
        </div>
      </main>

      <!-- Footer Académico -->
      <footer class="bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-slate-800 py-6">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center space-x-3">
              <span class="font-bold text-admin-primary dark:text-purple-400 text-lg">FCE</span>
              <span class="h-4 w-px bg-gray-300 dark:bg-gray-600"></span>
              <span class="text-sm text-gray-500 dark:text-gray-400">Universidad Nacional de Colombia</span>
            </div>
            <div class="text-center md:text-right">
              <p class="text-xs text-gray-400">
                © 2026 Facultad de Ciencias Económicas - Unidad Informática de la Facultad de Ciencias Económicas
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class ValidationPortalComponent {
  searchHash = signal('');
  foundBadge = signal<any>(null);
  currentRole = signal<'Estudiante' | 'Administrativo'>('Estudiante');

  onRoleChange(role: 'Estudiante' | 'Administrativo') {
    this.currentRole.set(role);
    if (role === 'Administrativo') {
      // Podrías redirigir al panel de admin automáticamente
      // this.router.navigate(['/admin/catalog']);
    }
  }

  onLogout() {
    console.log('Cerrando sesión...');
  }

  search() {
    if (this.searchHash().trim()) {
      if (this.searchHash() === '123' || this.searchHash().length > 3) {
        this.foundBadge.set({
          name: 'Analista de Datos Jr',
          student: 'Juan Pérez',
          date: '10/02/2026',
          course: 'Introducción a Power BI y SQL'
        });
      } else {
        alert('No se encontró ninguna insignia con ese código.');
        this.foundBadge.set(null);
      }
    }
  }
}
