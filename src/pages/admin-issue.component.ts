
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-issue',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-background-light dark:bg-background-dark font-display text-text-main-light dark:text-text-main-dark min-h-screen flex flex-col transition-colors duration-200">
      <header class="bg-admin-primary text-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center border-b border-purple-800/30">
          <div class="flex items-center space-x-2 cursor-pointer" routerLink="/">
            <div class="flex flex-col">
              <span class="font-bold text-xl tracking-tight">FCE</span>
              <span class="text-[10px] leading-tight opacity-90">Facultad de<br/>Ciencias Económicas</span>
            </div>
          </div>
          <div class="flex items-center">
            <div class="text-right">
              <span class="block font-bold text-xl tracking-tight">UIFCE</span>
              <span class="block text-[8px] tracking-wider uppercase opacity-80">Unidad de Informática</span>
            </div>
          </div>
        </div>
        <div class="container mx-auto px-4 py-2 text-sm flex flex-wrap items-center justify-between gap-y-2">
          <div class="flex items-center gap-4 ml-auto">
            <div class="flex items-center gap-2">
              <span class="material-icons-outlined text-lg">person</span>
              <span class="font-medium">Ángel David</span>
              <span class="bg-purple-800 text-xs px-2 py-0.5 rounded-full text-purple-100 border border-purple-700">Administrador</span>
            </div>
            <button class="hover:bg-purple-700 p-1 rounded transition-colors" routerLink="/">
              <span class="material-icons-outlined">logout</span>
            </button>
          </div>
        </div>
      </header>
      
      <main class="flex-grow container mx-auto px-4 py-8">
        <div class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6 mb-6 border border-slate-200 dark:border-slate-700">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-admin-primary dark:text-purple-400">Emisión Masiva de Insignias</h1>
              <p class="text-gray-500 dark:text-gray-400 mt-1">Cargue un archivo Excel para procesar y emitir certificados de forma masiva.</p>
            </div>
            <div class="flex gap-3">
              <button routerLink="/admin/catalog" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors border border-transparent">
                <span class="material-icons-outlined text-lg">arrow_back</span>
                Volver al Panel
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border-2 border-dashed border-purple-300 dark:border-purple-700 hover:border-admin-secondary dark:hover:border-purple-500 transition-all p-10 flex flex-col items-center justify-center text-center group cursor-pointer h-80 relative overflow-hidden">
              <div class="absolute inset-0 bg-purple-50 dark:bg-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div class="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <span class="material-icons-outlined text-5xl text-purple-600 dark:text-purple-400">description</span>
              </div>
              <h3 class="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">Arrastre el archivo de aprobados aquí</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">Soporta formatos .xlsx, .csv (Max 5MB)</p>
              <button class="bg-admin-primary hover:bg-primary-dark text-white font-medium py-2.5 px-6 rounded-lg shadow transition-colors flex items-center gap-2">
                <span class="material-icons-outlined">upload_file</span>
                Seleccionar Archivo
              </button>
            </div>

            <div class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span class="material-icons-outlined text-admin-primary dark:text-purple-400">info</span>
                </div>
                <div>
                  <h4 class="font-medium text-sm text-gray-900 dark:text-gray-100">Plantilla Requerida</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Asegúrese de usar el formato correcto para evitar errores.</p>
                </div>
              </div>
              <a class="text-sm font-medium text-admin-primary dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors" href="#">
                <span class="material-icons-outlined text-base">download</span>
                Descargar Plantilla Excel
              </a>
            </div>

            <div class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <h3 class="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span class="material-icons-outlined text-gray-400">assignment</span>
                  Registro de Validación
                </h3>
                <span class="text-xs font-medium px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
                  Pendiente de carga
                </span>
              </div>
              <div class="p-0">
                <div class="py-12 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                  <span class="material-icons-outlined text-4xl mb-2 opacity-50">toc</span>
                  <p class="text-sm">Los detalles del procesamiento aparecerán aquí una vez cargado el archivo.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-1 space-y-6">
            <div class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Acciones</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Registros Totales:</span>
                  <span class="font-medium text-gray-900 dark:text-gray-100">0</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Registros Válidos:</span>
                  <span class="font-medium text-green-600 dark:text-green-400">0</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Errores:</span>
                  <span class="font-medium text-red-600 dark:text-red-400">0</span>
                </div>
                <div class="pt-4 mt-2 border-t border-slate-200 dark:border-slate-700">
                  <button class="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold py-3 px-4 rounded-lg shadow-sm cursor-not-allowed transition-colors flex justify-center items-center gap-2 disabled:opacity-70 enabled:bg-admin-primary enabled:hover:bg-primary-dark enabled:text-white" disabled>
                    <span class="material-icons-outlined">send</span>
                    Emitir Insignias Masivamente
                  </button>
                  <p class="text-xs text-center mt-2 text-gray-400 dark:text-gray-500">
                    El botón se habilitará cuando la validación sea exitosa.
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl shadow-sm p-6 border border-purple-100 dark:border-purple-800/50">
              <h3 class="font-bold text-admin-primary dark:text-purple-300 mb-3 flex items-center gap-2">
                <span class="material-icons-outlined">lightbulb</span>
                Instrucciones
              </h3>
              <ul class="text-sm space-y-3 text-gray-700 dark:text-gray-300 list-disc list-inside">
                <li>El archivo debe contener las columnas: <strong>Documento</strong>, <strong>Nombre</strong>, <strong>Email</strong>, <strong>Código Curso</strong>, <strong>Nota Final</strong>.</li>
                <li>La nota debe ser numérica (0.0 a 5.0).</li>
                <li>El sistema notificará automáticamente por correo a los estudiantes aprobados.</li>
                <li>Las insignias se generarán en formato Open Badges 2.0.</li>
              </ul>
            </div>

            <div class="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 class="font-bold text-gray-800 dark:text-gray-200 mb-4 text-sm uppercase tracking-wide">Cargas Recientes</h3>
              <div class="space-y-4">
                <div class="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                  <div class="mt-0.5 p-1.5 bg-green-100 dark:bg-green-900/30 rounded text-green-600 dark:text-green-400">
                    <span class="material-icons-outlined text-sm">check</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Curso Power BI - G1</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">24 aprobados • Hace 2 horas</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                  <div class="mt-0.5 p-1.5 bg-green-100 dark:bg-green-900/30 rounded text-green-600 dark:text-green-400">
                    <span class="material-icons-outlined text-sm">check</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Excel Avanzado</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">15 aprobados • Ayer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer class="bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
        <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <div class="mb-4 md:mb-0 flex items-center gap-4">
            <div class="flex flex-col">
              <span class="font-bold text-gray-800 dark:text-gray-300 text-sm">UIFCE</span>
              <span>Unidad de Informática</span>
              <span>Sede de Bogotá</span>
            </div>
          </div>
          <div class="text-center md:text-right">
            <p>Facultad de Ciencias Económicas</p>
            <p>Universidad Nacional de Colombia</p>
            <p class="mt-1 opacity-70">© 2024 Todos los derechos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AdminIssueComponent {}
