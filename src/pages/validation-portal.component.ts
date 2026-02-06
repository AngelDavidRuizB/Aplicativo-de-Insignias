
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-validation-portal',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="font-display min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-header-brand text-white shadow-md z-20">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex flex-col leading-tight">
              <span class="font-bold text-2xl tracking-tighter font-serif">FCE</span>
              <span class="text-[10px] uppercase tracking-wide opacity-90">Facultad de<br/>Ciencias Económicas</span>
            </div>
          </div>
          <div class="flex items-center space-x-3 text-right">
            <div class="flex flex-col leading-tight">
              <span class="font-bold text-2xl tracking-tighter">UIFCE</span>
              <span class="text-[9px] uppercase tracking-wider opacity-80 border-t border-white/30 pt-0.5 mt-0.5">Unidad de Informática</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Nav -->
      <nav class="bg-primary dark:bg-purple-900 text-white shadow-lg z-10 relative">
        <div class="container mx-auto px-4">
          <div class="flex items-center gap-4 overflow-x-auto py-3 no-scrollbar">
            <a class="flex items-center px-5 py-2.5 text-sm font-bold bg-white/20 border border-white/10 rounded-xl hover:bg-white/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap cursor-pointer">
              <span class="material-icons-outlined text-xl mr-2">verified</span>
              Validar Insignia
            </a>
            <a class="flex items-center px-5 py-2.5 text-sm font-medium hover:bg-white/10 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap cursor-pointer border border-transparent hover:border-white/10">
              <span class="material-icons-outlined text-xl mr-2">help_outline</span>
              Ayuda
            </a>
            <a routerLink="/admin/catalog" class="flex items-center px-5 py-2.5 text-sm font-medium hover:bg-white/10 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap ml-auto cursor-pointer border border-transparent hover:border-white/10">
              <span class="material-icons-outlined text-xl mr-2">login</span>
              Acceso Administrativo
            </a>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-grow flex flex-col items-center justify-center p-4 md:p-8 bg-hero-pattern relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div class="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl"></div>
          <div class="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-purple-300/10 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
        </div>

        <div class="w-full max-w-2xl bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-300">
          <div class="p-8 pb-4 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 text-primary mb-4">
              <span class="material-icons-outlined text-4xl">workspace_premium</span>
            </div>
            <h1 class="text-3xl font-bold text-text-main-light dark:text-text-main-dark mb-2">
              Verificación de Insignias
            </h1>
            <p class="text-text-muted-light dark:text-text-muted-dark text-sm md:text-base">
              Bienvenido al portal oficial de validación. Ingrese el código único o escanee el QR para verificar la autenticidad de una certificación.
            </p>
          </div>

          <div class="p-8 pt-4 space-y-6">
            <div class="relative group">
              <label class="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1 ml-1" for="hash-code">
                Código Único de Validación (Hash)
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-icons-outlined text-slate-400">vpn_key</span>
                </div>
                <input 
                  [(ngModel)]="searchHash"
                  class="block w-full pl-10 pr-32 py-4 text-base bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:text-white placeholder-slate-400 transition-shadow shadow-sm outline-none" 
                  id="hash-code" 
                  placeholder="Ej: a1b2-c3d4-e5f6-g7h8" 
                  type="text"/>
                <button (click)="search()" class="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary-dark text-white font-medium px-6 rounded-md transition-colors flex items-center shadow-md">
                  Buscar
                </button>
              </div>
            </div>

            <div class="relative flex items-center py-2">
              <div class="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span class="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider font-semibold">O validar con</span>
              <div class="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            <button class="w-full flex items-center justify-center space-x-3 py-3 px-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-text-muted-light dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
              <span class="material-icons-outlined text-2xl group-hover:scale-110 transition-transform">qr_code_scanner</span>
              <span class="font-medium">Escanear código QR con la cámara</span>
            </button>
          </div>

          <div class="bg-slate-50 dark:bg-slate-900/50 px-8 py-4 border-t border-slate-100 dark:border-slate-700">
            <p class="text-xs text-center text-slate-400 mb-3 uppercase tracking-wider">Certificaciones soportadas</p>
            <div class="flex justify-center items-center space-x-6 md:space-x-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div class="flex items-center space-x-1 group cursor-default" title="R Language">
                <span class="font-serif font-bold text-xl text-slate-600 dark:text-slate-400 group-hover:text-primary">R</span>
              </div>
              <div class="flex items-center space-x-1 group cursor-default" title="PostgreSQL">
                <span class="material-icons-outlined text-slate-600 dark:text-slate-400 text-xl group-hover:text-primary">storage</span>
                <span class="font-bold text-sm text-slate-600 dark:text-slate-400 hidden sm:block">PostgreSQL</span>
              </div>
              <div class="flex items-center space-x-1 group cursor-default" title="PowerBI">
                <span class="material-icons-outlined text-slate-600 dark:text-slate-400 text-xl group-hover:text-yellow-600">bar_chart</span>
                <span class="font-bold text-sm text-slate-600 dark:text-slate-400 hidden sm:block">PowerBI</span>
              </div>
              <div class="flex items-center space-x-1 group cursor-default" title="Python">
                <span class="material-icons-outlined text-slate-600 dark:text-slate-400 text-xl group-hover:text-green-600">code</span>
                <span class="font-bold text-sm text-slate-600 dark:text-slate-400 hidden sm:block">Python</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 text-center space-y-2">
          <a routerLink="/student" class="text-primary hover:underline text-sm font-medium cursor-pointer">¿Eres estudiante? Ingresa a tu panel aquí</a>
          <div class="text-slate-400 text-xs">
            UIFCE - Unidad de Informática | Universidad Nacional
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-surface-light dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 py-8 transition-colors duration-200">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex space-x-4">
              <!-- Social placeholders -->
              <a class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                 <span class="font-bold">X</span>
              </a>
              <a class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                 <span class="font-bold">in</span>
              </a>
              <a class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                 <span class="material-icons text-sm">photo_camera</span>
              </a>
              <a class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                 <span class="material-icons text-sm">language</span>
              </a>
            </div>
            <div class="text-center md:text-right">
              <p class="text-sm font-semibold text-text-main-light dark:text-text-main-dark">UIFCE - Unidad de Informática</p>
              <p class="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                © 2024 Facultad de Ciencias Económicas<br/>Universidad Nacional de Colombia
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

  search() {
    if (this.searchHash().trim()) {
      alert(`Buscando certificado con hash: ${this.searchHash()}`);
    }
  }
}
