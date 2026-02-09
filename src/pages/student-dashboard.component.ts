
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-100 font-display min-h-screen flex flex-col transition-colors duration-200">
      <header class="bg-admin-primary text-white shadow-lg sticky top-0 z-50">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center border-b border-purple-400/30">
          <div class="flex items-center space-x-4 cursor-pointer" routerLink="/">
            <div class="flex flex-col">
              <span class="text-2xl font-bold tracking-tight">FCE</span>
              <span class="text-xs uppercase tracking-wider opacity-90">Facultad de Ciencias Económicas</span>
            </div>
          </div>
          <div>
            <span class="text-2xl font-bold tracking-widest">UIFCE</span>
          </div>
        </div>
        <nav class="container mx-auto px-4 py-2">
          <div class="flex flex-col md:flex-row justify-end items-center gap-4">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2 bg-black/20 px-4 py-1.5 rounded-full">
                <span class="material-icons text-lg">person</span>
                <span class="font-medium text-sm">Ángel David</span>
                <span class="bg-admin-secondary text-xs px-2 py-0.5 rounded text-white font-bold uppercase tracking-wider ml-2">Estudiante</span>
              </div>
              <button class="hover:bg-white/10 p-2 rounded-full transition" routerLink="/">
                <span class="material-icons transform rotate-180">logout</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main class="container mx-auto px-4 py-8 flex-grow">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">Panel del Estudiante</h1>
          <p class="text-gray-500 dark:text-gray-400">Gestiona tu progreso académico y certificaciones.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-1">
            <div class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 sticky top-40">
              <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <span class="material-icons text-admin-primary mr-2">military_tech</span>
                Progreso de Convalidación
              </h2>
              <div class="flex flex-col items-center justify-center mb-6">
                <div class="relative w-48 h-48">
                  <svg class="w-full h-full transform -rotate-90">
                    <circle class="text-gray-200 dark:text-gray-700" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" stroke-width="12"></circle>
                    <defs>
                      <linearGradient id="purpleGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" style="stop-color:#9c27b0;stop-opacity:1"></stop>
                        <stop offset="100%" style="stop-color:#5c1e7a;stop-opacity:1"></stop>
                      </linearGradient>
                    </defs>
                    <circle cx="96" cy="96" fill="transparent" r="88" stroke="url(#purpleGradient)" stroke-dasharray="552" stroke-dashoffset="184" stroke-linecap="round" stroke-width="12"></circle>
                  </svg>
                  <div class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <span class="text-4xl font-bold text-gray-800 dark:text-white">2/3</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Insignias</span>
                  </div>
                </div>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-lg p-4 text-center">
                <p class="text-admin-primary dark:text-purple-300 font-medium text-sm leading-relaxed">
                  <span class="material-icons text-lg align-middle mr-1">info</span>
                  ¡Te falta <span class="font-bold">1 insignia</span> para convalidar <span class="font-bold">2 créditos</span> de libre elección!
                </p>
              </div>
              <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Próximos Pasos</h3>
                <button (click)="viewCourses()" class="block w-full bg-admin-primary hover:bg-primary-dark text-white text-center font-medium py-3 rounded-lg transition shadow-sm cursor-pointer">
                   Ver Cursos Disponibles
                 </button>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2">
            <div class="flex flex-col mb-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Galería de Logros</h2>
                <div class="flex space-x-2">
                  <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="Ver lista">
                    <span class="material-icons">view_list</span>
                  </button>
                  <button class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="Ver cuadrícula">
                    <span class="material-icons">grid_view</span>
                  </button>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-sm font-semibold text-gray-500 dark:text-gray-400 mr-2 uppercase tracking-wide text-xs">Filtrar por Unidad:</span>
                <button class="px-3 py-1.5 rounded-full text-sm font-medium bg-admin-primary text-white shadow-sm ring-1 ring-admin-primary transition-all">
                    Todas
                </button>
                <button class="px-3 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-admin-primary hover:text-admin-primary dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                    Unidad de Informática
                </button>
                <button class="px-3 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-admin-primary hover:text-admin-primary dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                    Posgrados
                </button>
                <button class="px-3 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-admin-primary hover:text-admin-primary dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                    Bienestar
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Card 1 -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group">
                <div class="h-2 bg-yellow-500 w-full"></div>
                <div class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
                      <span class="material-icons text-3xl text-yellow-600 dark:text-yellow-500">bar_chart</span>
                    </div>
                    <span class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full font-bold uppercase">Completado</span>
                  </div>
                  <span class="bg-admin-primary/10 text-admin-primary dark:text-purple-300 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2 inline-block">Unidad de Informática</span>
                  <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-admin-primary transition-colors">Power BI para Análisis de Datos</h3>
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 space-x-4">
                    <span class="flex items-center">
                      <span class="material-icons text-base mr-1">schedule</span>
                      20 Horas
                    </span>
                    <span class="flex items-center">
                      <span class="material-icons text-base mr-1">event</span>
                      Ago 2023
                    </span>
                  </div>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div class="flex -space-x-2">
                      <img alt="Instructor 1" class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://picsum.photos/32/32?random=1"/>
                      <img alt="Instructor 2" class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://picsum.photos/32/32?random=2"/>
                    </div>
                    <button class="flex items-center text-admin-primary hover:text-primary-dark dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm transition">
                      <span class="material-icons text-lg mr-1">download</span>
                      Certificado
                    </button>
                  </div>
                </div>
              </div>

              <!-- Card 2 -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group">
                <div class="h-2 bg-admin-primary w-full"></div>
                <div class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-100 dark:border-purple-800/30">
                      <span class="material-icons text-3xl text-admin-primary dark:text-purple-400">storage</span>
                    </div>
                    <span class="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full font-bold uppercase">Completado</span>
                  </div>
                  <span class="bg-admin-primary/10 text-admin-primary dark:text-purple-300 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2 inline-block">Unidad de Informática</span>
                  <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-admin-primary transition-colors">Administración de Bases de Datos MySQL</h3>
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 space-x-4">
                    <span class="flex items-center">
                      <span class="material-icons text-base mr-1">schedule</span>
                      25 Horas
                    </span>
                    <span class="flex items-center">
                      <span class="material-icons text-base mr-1">event</span>
                      Sep 2023
                    </span>
                  </div>
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div class="flex -space-x-2">
                       <img alt="Instructor 1" class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800" src="https://picsum.photos/32/32?random=3"/>
                    </div>
                    <button class="flex items-center text-admin-primary hover:text-primary-dark dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm transition">
                      <span class="material-icons text-lg mr-1">download</span>
                      Certificado
                    </button>
                  </div>
                </div>
              </div>

              <!-- Card 3 -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden opacity-90">
                <div class="h-2 bg-gray-300 dark:bg-gray-600 w-full"></div>
                <div class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <span class="material-icons text-3xl text-gray-500 dark:text-gray-400">functions</span>
                    </div>
                    <span class="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs px-2 py-1 rounded-full font-bold uppercase">En Curso</span>
                  </div>
                  <span class="bg-admin-primary/10 text-admin-primary dark:text-purple-300 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2 inline-block">Unidad de Posgrados</span>
                  <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-2">Análisis Estadístico con R</h3>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                    <div class="bg-admin-secondary h-2 rounded-full" style="width: 45%"></div>
                  </div>
                  <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>45% Completado</span>
                    <a class="text-admin-secondary hover:text-admin-primary hover:underline cursor-pointer">Continuar</a>
                  </div>
                </div>
              </div>

              <!-- Card 4 -->
              <div class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden opacity-60 relative group cursor-not-allowed">
                <div class="h-2 bg-gray-200 dark:bg-gray-800 w-full"></div>
                <div class="absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="bg-black/75 text-white px-3 py-1 rounded text-sm">Disponible Próximamente</span>
                </div>
                <div class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 grayscale">
                      <span class="material-icons text-3xl text-gray-400">psychology</span>
                    </div>
                    <span class="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs px-2 py-1 rounded-full font-bold uppercase">Pendiente</span>
                  </div>
                  <span class="bg-admin-primary/10 text-admin-primary dark:text-purple-300 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-2 inline-block">Unidad de Investigaciones</span>
                  <h3 class="text-lg font-bold text-gray-500 dark:text-gray-400 mb-2">Machine Learning Básico</h3>
                  <div class="flex items-center text-sm text-gray-400 dark:text-gray-500 mb-4 space-x-4">
                    <span class="flex items-center">
                      <span class="material-icons text-base mr-1">schedule</span>
                      30 Horas
                    </span>
                  </div>
                  <div class="pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                    <span class="text-xs text-gray-400 italic">Requiere completar Power BI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer class="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8 pb-4">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="flex items-center space-x-2 mb-4 md:mb-0">
              <span class="font-bold text-admin-primary dark:text-purple-400 text-xl">FCE</span>
              <span class="h-4 w-px bg-gray-300 dark:bg-gray-600"></span>
              <span class="text-sm text-gray-500 dark:text-gray-400">Universidad Nacional de Colombia</span>
            </div>
            <div class="flex space-x-4">
              <a class="text-gray-400 hover:text-admin-primary dark:hover:text-white transition" href="#">
                <span class="material-icons">facebook</span>
              </a>
              <a class="text-gray-400 hover:text-admin-primary dark:hover:text-white transition" href="#">
                <span class="material-icons">email</span>
              </a>
            </div>
          </div>
          <div class="text-center mt-6 text-xs text-gray-400 dark:text-gray-600">
            © 2024 Unidad de Informática y Comunicaciones FCE. Todos los derechos reservados.
          </div>
        </footer>
      </main>
    </div>
  `
})
export class StudentDashboardComponent {
  viewCourses() {
    alert('Redirigiendo al catálogo de cursos de la Facultad...');
  }
}
