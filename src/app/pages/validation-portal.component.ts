import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { PdfService } from '../services/pdf.service';
import { IssuedBadge } from '../models/badge.model';

@Component({
  selector: 'app-validation-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <!-- Header -->
      <header class="bg-[#4a148c] text-white shadow-md">
        <div class="container mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            <!-- Logo FCE -->
            <div class="flex items-center space-x-3">
              <div class="flex flex-col leading-tight">
                <span class="font-bold text-2xl tracking-tighter font-serif">FCE</span>
                <span class="text-[10px] uppercase tracking-wide opacity-90">Facultad de Ciencias Económicas</span>
              </div>
            </div>
            <!-- Logo UIFCE -->
            <div class="flex items-center space-x-3 text-right">
              <div class="flex flex-col leading-tight">
                <span class="font-bold text-2xl tracking-tighter">UIFCE</span>
                <span class="text-[9px] uppercase tracking-wider opacity-80 border-t border-white/30 pt-0.5 mt-0.5">Unidad Informática de la Facultad de Ciencias Económicas</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Navigation Bar -->
      <nav class="bg-[#3a106c] text-white border-t border-white/20">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-end py-3 gap-4">
            <button 
              routerLink="/student"
              class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">
              <span class="material-icons">person</span>
              <span>Soy Estudiante</span>
            </button>
            <button 
              routerLink="/admin/catalog"
              class="flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-purple-50 text-sm font-medium">
              <span class="material-icons">admin_panel_settings</span>
              <span>Administración</span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 container mx-auto px-4 py-12">
        <div class="max-w-3xl mx-auto">
          <!-- Logo UIFCE Grande -->
          <div class="text-center mb-10">
            <div class="inline-flex flex-col items-center">
              <span class="text-7xl md:text-8xl font-bold tracking-tighter text-admin-primary">UIFCE</span>
              <span class="text-base md:text-lg uppercase tracking-[0.4em] text-gray-500 mt-3 font-medium">Unidad Informática de la Facultad de Ciencias Económicas</span>
              <div class="w-32 h-1 bg-admin-primary mt-5"></div>
            </div>
          </div>

          <!-- Title Section -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-3">
              Verificación de Insignias
            </h1>
            <p class="text-gray-600">
              Sistema de validación de certificaciones digitales emitidas por la Facultad de Ciencias Económicas
            </p>
          </div>

          <!-- Search Card -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-3">
                Código de Verificación
              </label>
              <div class="flex gap-3">
                <input 
                  [(ngModel)]="searchCode"
                  (keyup.enter)="validateCode()"
                  type="text" 
                  placeholder="Ej: ABCD-1234-EFGH-5678"
                  class="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-admin-primary focus:border-admin-primary outline-none uppercase text-base"
                  [disabled]="isValidating()"/>
                <button 
                  (click)="validateCode()"
                  [disabled]="isValidating() || !searchCode()"
                  class="px-8 py-3 bg-[#6a1b9a] hover:bg-[#5a1090] disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-colors duration-200">
                  <span class="material-icons">search</span>
                  <span>{{ isValidating() ? 'Validando...' : 'Validar' }}</span>
                </button>
              </div>
            </div>

            <!-- Certificaciones Soportadas -->
            <div class="border-t border-gray-100 pt-6">
              <p class="text-xs text-center text-gray-400 mb-4 uppercase tracking-wider font-medium">Certificaciones disponibles</p>
              <div class="flex justify-center items-center gap-8 md:gap-12">
                <div class="flex items-center gap-2 text-gray-500">
                  <span class="font-serif font-bold text-2xl">R</span>
                </div>
                <div class="flex items-center gap-2 text-gray-500">
                  <span class="material-icons text-xl">storage</span>
                  <span class="font-medium">PostgreSQL</span>
                </div>
                <div class="flex items-center gap-2 text-gray-500">
                  <span class="material-icons text-xl">bar_chart</span>
                  <span class="font-medium">PowerBI</span>
                </div>
                <div class="flex items-center gap-2 text-gray-500">
                  <span class="material-icons text-xl">code</span>
                  <span class="font-medium">Python</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Validation Result -->
          @if (validationResult(); as result) {
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <!-- Valid Badge -->
              @if (result.valid) {
                <div class="bg-green-600 p-6 text-white">
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
                      <h4 class="text-sm font-semibold text-gray-500 uppercase mb-3">Información del Certificado</h4>
                      <div class="space-y-3">
                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <span class="material-icons text-admin-primary">workspace_premium</span>
                          <div>
                            <p class="text-xs text-gray-500">Insignia</p>
                            <p class="font-medium text-gray-800">{{ result.data!.badgeName }}</p>
                          </div>
                        </div>

                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <span class="material-icons text-admin-primary">schedule</span>
                          <div>
                            <p class="text-xs text-gray-500">Fecha de Emisión</p>
                            <p class="font-medium text-gray-800">{{ formatDate(result.data!.issueDate) }}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Student Info -->
                    <div>
                      <h4 class="text-sm font-semibold text-gray-500 uppercase mb-3">Estudiante</h4>
                      <div class="space-y-3">
                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <span class="material-icons text-admin-primary">person</span>
                          <div>
                            <p class="text-xs text-gray-500">Nombre</p>
                            <p class="font-medium text-gray-800">{{ result.data!.studentName }}</p>
                          </div>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <span class="material-icons text-admin-primary">badge</span>
                          <div>
                            <p class="text-xs text-gray-500">Documento</p>
                            <p class="font-medium text-gray-800">{{ result.data!.studentDocument }}</p>
                          </div>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <span class="material-icons text-admin-primary">grade</span>
                          <div>
                            <p class="text-xs text-gray-500">Calificación</p>
                            <p class="font-medium text-gray-800">{{ result.data!.grade }}/5.0</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button 
                      (click)="downloadCertificate(result.data!)"
                      class="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-admin-primary hover:bg-purple-800 text-white rounded-lg font-semibold">
                      <span class="material-icons">download</span>
                      Descargar Certificado
                    </button>
                    <button 
                      (click)="shareResult(result.data!)"
                      class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg">
                      <span class="material-icons">share</span>
                    </button>
                  </div>

                  <!-- Verification Code -->
                  <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p class="text-xs text-gray-500 mb-1">Código de Verificación</p>
                    <p class="font-mono text-lg text-gray-800">{{ result.data!.hash }}</p>
                  </div>
                </div>
              } @else {
                <!-- Invalid Badge -->
                <div class="bg-red-600 p-6 text-white">
                  <div class="flex items-center gap-3">
                    <span class="material-icons text-4xl">error</span>
                    <div>
                      <h3 class="text-xl font-bold">Insignia No Encontrada</h3>
                      <p class="text-red-100">El código ingresado no corresponde a ninguna insignia válida</p>
                    </div>
                  </div>
                </div>
                <div class="p-6 text-center">
                  <p class="text-gray-600 mb-4">
                    Verifique que el código esté correctamente escrito e intente nuevamente.
                  </p>
                  <button 
                    (click)="clearResult()"
                    class="px-6 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg">
                    Intentar Nuevamente
                  </button>
                </div>
              }
            </div>
          }

        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-auto">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center space-x-3">
              <span class="font-bold text-admin-primary text-lg">FCE</span>
              <span class="h-4 w-px bg-gray-300"></span>
              <span class="text-sm text-gray-500">Universidad Nacional de Colombia</span>
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
