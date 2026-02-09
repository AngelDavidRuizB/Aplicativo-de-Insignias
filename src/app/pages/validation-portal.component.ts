import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { PdfService } from '../services/pdf.service';
import { IssuedBadge, Badge } from '../models/badge.model';

@Component({
  selector: 'app-validation-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 transition-colors duration-300">
      <!-- Header -->
      <header class="bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-xl">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span class="material-icons text-3xl">school</span>
              </div>
              <div>
                <h1 class="text-xl font-bold">FCE - Universidad Nacional</h1>
                <p class="text-sm text-purple-200">Sistema de Insignias Digitales</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <button 
                routerLink="/student"
                class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <span class="material-icons">person</span>
                <span class="hidden sm:inline">Soy Estudiante</span>
              </button>
              <button 
                routerLink="/admin/catalog"
                class="flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium">
                <span class="material-icons">admin_panel_settings</span>
                <span class="hidden sm:inline">Administración</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
          <!-- Logo Section -->
          <div class="text-center mb-8">
            <div class="relative inline-block">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <img 
                src="assets/logo.png" 
                alt="Logo Unidad de Informática" 
                class="relative w-48 h-48 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                (error)="$event.target.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBmaWxsPSJub25lIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0idXJsKCNncmFkaWVudCkiLz48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjN2MzYWVkIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMjU2M2ViIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHN2ZyB4PSI1MCIgeT0iNTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj48cGF0aCBkPSJNMTIgM0wxIDE5TDIzIDE5TDEyIDNaTTEyIDZMMTkuNSAxOEg0LjVMMTIgNloiLz48cGF0aCBkPSJNMTIgOEw2IDE4TDE4IDE4TDEyIDhaIi8+PC9zdmc+PC9zdmc+'"
              />
            </div>
            <h2 class="text-4xl font-bold text-gray-800 dark:text-white mt-6 mb-3">
              Verificación de Insignias
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Sistema de validación de certificaciones digitales emitidas por la 
              <span class="text-purple-600 dark:text-purple-400 font-semibold">Facultad de Ciencias Económicas</span>
            </p>
          </div>

          <!-- Search Section -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8">
            <!-- Manual Input -->
            <div class="mb-8">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código de Verificación
              </label>
              <div class="flex gap-2">
                <input 
                  [(ngModel)]="searchCode"
                  (keyup.enter)="validateCode()"
                  type="text" 
                  placeholder="Ej: ABCD-1234-EFGH-5678"
                  class="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all uppercase"
                  [disabled]="isValidating()"/>
                <button 
                  (click)="validateCode()"
                  [disabled]="isValidating() || !searchCode()"
                  class="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                  <span class="material-icons">search</span>
                  <span>{{ isValidating() ? 'Validando...' : 'Validar' }}</span>
                </button>
              </div>
            </div>


          </div>

          <!-- Validation Result -->
          @if (validationResult(); as result) {
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
              <!-- Valid Badge -->
              @if (result.valid) {
                <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                  <div class="flex items-center gap-3">
                    <span class="material-icons text-4xl">check_circle</span>
                    <div>
                      <h3 class="text-xl font-bold">Insignia Válida</h3>
                      <p class="text-green-100">Este certificado es auténtico</p>
                    </div>
                  </div>
                </div>
                
                <div class="p-6">
                  <div class="grid md:grid-cols-2 gap-6">
                    <!-- Badge Info -->
                    <div>
                      <h4 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Información del Certificado</h4>
                      <div class="space-y-3">
                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <span class="material-icons text-purple-500">workspace_premium</span>
                          <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Insignia</p>
                            <p class="font-medium text-gray-800 dark:text-white">{{ result.data!.badgeName }}</p>
                          </div>
                        </div>

                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <span class="material-icons text-purple-500">schedule</span>
                          <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Fecha de Emisión</p>
                            <p class="font-medium text-gray-800 dark:text-white">{{ formatDate(result.data!.issueDate) }}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Student Info -->
                    <div>
                      <h4 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">Estudiante</h4>
                      <div class="space-y-3">
                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <span class="material-icons text-purple-500">person</span>
                          <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Nombre</p>
                            <p class="font-medium text-gray-800 dark:text-white">{{ result.data!.studentName }}</p>
                          </div>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <span class="material-icons text-purple-500">badge</span>
                          <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Documento</p>
                            <p class="font-medium text-gray-800 dark:text-white">{{ result.data!.studentDocument }}</p>
                          </div>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <span class="material-icons text-purple-500">grade</span>
                          <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Calificación</p>
                            <p class="font-medium text-gray-800 dark:text-white">{{ result.data!.grade }}/5.0</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      (click)="downloadCertificate(result.data!)"
                      class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                      <span class="material-icons">download</span>
                      Descargar Certificado
                    </button>
                    <button 
                      (click)="shareResult(result.data!)"
                      class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                      <span class="material-icons">share</span>
                    </button>
                  </div>

                  <!-- Verification Code -->
                  <div class="mt-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Código de Verificación</p>
                    <p class="font-mono text-lg text-gray-800 dark:text-white">{{ result.data!.hash }}</p>
                  </div>
                </div>
              } @else {
                <!-- Invalid Badge -->
                <div class="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                  <div class="flex items-center gap-3">
                    <span class="material-icons text-4xl">error</span>
                    <div>
                      <h3 class="text-xl font-bold">Insignia No Encontrada</h3>
                      <p class="text-red-100">El código ingresado no corresponde a ninguna insignia válida</p>
                    </div>
                  </div>
                </div>
                <div class="p-6 text-center">
                  <p class="text-gray-600 dark:text-gray-300 mb-4">
                    Verifique que el código esté correctamente escrito e intente nuevamente.
                  </p>
                  <button 
                    (click)="clearResult()"
                    class="px-6 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                    Intentar Nuevamente
                  </button>
                </div>
              }
            </div>
          }

          <!-- Softwares Section - Certificaciones Soportadas -->
          <div class="mt-12 mb-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div class="text-center mb-6">
              <p class="text-xs font-semibold tracking-widest text-gray-400 dark:text-gray-500 uppercase mb-4">Certificaciones Soportadas</p>
              <div class="flex flex-wrap justify-center items-center gap-6 md:gap-8">
                <!-- R -->
                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-default">
                  <span class="font-serif font-bold text-xl">R</span>
                </div>
                
                <!-- PostgreSQL -->
                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-default">
                  <span class="material-icons text-lg">storage</span>
                  <span class="text-sm font-medium">PostgreSQL</span>
                </div>
                
                <!-- PowerBI -->
                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors cursor-default">
                  <span class="material-icons text-lg">bar_chart</span>
                  <span class="text-sm font-medium">PowerBI</span>
                </div>
                
                <!-- Python -->
                <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-default">
                  <span class="material-icons text-lg">code</span>
                  <span class="text-sm font-medium">Python</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-center md:text-left">
              <p class="font-semibold text-gray-800 dark:text-white">UIFCE - Unidad de Informática</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Facultad de Ciencias Económicas</p>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Universidad Nacional de Colombia
            </p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
  `]
})
export class ValidationPortalComponent {
  private storageService = inject(StorageService);
  private toastService = inject(ToastService);
  private pdfService = inject(PdfService);

  searchCode = signal('');
  isValidating = signal(false);
  validationResult = signal<{valid: boolean; data?: IssuedBadge} | null>(null);



  async validateCode(): Promise<void> {
    const code = this.searchCode().trim().toUpperCase();
    if (!code) {
      this.toastService.warning('Ingrese un código de verificación');
      return;
    }

    this.isValidating.set(true);
    
    // Simular pequeña demora de red
    await new Promise(resolve => setTimeout(resolve, 800));

    const issued = this.storageService.validateBadge(code);
    
    if (issued) {
      this.validationResult.set({ valid: true, data: issued });
      this.toastService.success('Insignia validada correctamente');
    } else {
      this.validationResult.set({ valid: false });
      this.toastService.error('Código no encontrado');
    }
    
    this.isValidating.set(false);
  }

  clearResult(): void {
    this.validationResult.set(null);
    this.searchCode.set('');
  }

  downloadCertificate(issued: IssuedBadge): void {
    const badge = this.storageService.getBadgeById(issued.badgeId);
    if (badge) {
      this.pdfService.downloadCertificate(issued, badge);
      this.toastService.success('Certificado descargado');
    }
  }

  async shareResult(issued: IssuedBadge): Promise<void> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Certificado Validado - FCE',
          text: `He validado mi certificado: ${issued.badgeName}`,
          url: window.location.href
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      this.toastService.success('Enlace copiado al portapapeles');
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
