import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { IssuedBadge, Badge, Student } from '../models/badge.model';

interface ValidationRecord {
  nombre: string;
  documento: string;
  email: string;
  nota: number;
  valido: boolean;
  error?: string;
}

@Component({
  selector: 'app-admin-issue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 transition-colors duration-300">
      <!-- Header -->
      <header class="bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-xl sticky top-0 z-40">
        <div class="container mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3" routerLink="/">
              <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                <span class="material-icons text-3xl">school</span>
              </div>
              <div>
                <h1 class="text-xl font-bold">Panel Administrativo</h1>
                <p class="text-sm text-purple-200">Emisión de Insignias</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="hidden sm:inline text-sm text-purple-200">{{ currentUser()?.name }}</span>
              <button 
                (click)="logout()"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <span class="material-icons">logout</span>
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-purple-800/50 border-t border-purple-600/50">
          <div class="container mx-auto px-4">
            <div class="flex gap-1 py-2 overflow-x-auto">
              <a routerLink="/admin/catalog" 
                 routerLinkActive="bg-white/20"
                 class="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-2">
                <span class="material-icons text-sm">workspace_premium</span>
                Catálogo
              </a>
              <a routerLink="/admin/issue" 
                 routerLinkActive="bg-white/20"
                 class="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-2">
                <span class="material-icons text-sm">send</span>
                Emitir
              </a>
              <a routerLink="/" 
                 class="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors whitespace-nowrap flex items-center gap-2 ml-auto">
                <span class="material-icons text-sm">public</span>
                Portal Público
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Badge Selection -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span class="material-icons text-purple-500">workspace_premium</span>
                1. Seleccionar Insignia
              </h2>
              <select 
                [(ngModel)]="selectedBadgeId"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none">
                <option value="">Seleccione una insignia...</option>
                @for (badge of activeBadges(); track badge.id) {
                  <option [value]="badge.id">{{ badge.name }}</option>
                }
              </select>
              
              @if (selectedBadge(); as badge) {
                <div class="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center" 
                         [class]="'bg-' + badge.colorTheme + '-100'">
                      <span class="material-icons" [class]="'text-' + badge.colorTheme + '-600'">{{ badge.icon }}</span>
                    </div>
                    <div>
                      <p class="font-bold text-gray-800 dark:text-white">{{ badge.name }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ badge.hours }} horas</p>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- File Upload -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span class="material-icons text-purple-500">upload_file</span>
                2. Cargar Lista de Estudiantes
              </h2>
              
              <!-- Drop Zone -->
              <div 
                (drop)="onDrop($event)"
                (dragover)="onDragOver($event)"
                (dragleave)="onDragLeave($event)"
                [class.border-purple-500]="isDragging()"
                [class.bg-purple-50]="isDragging()"
                class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
                (click)="fileInput.click()">
                
                <input 
                  #fileInput
                  type="file" 
                  accept=".csv,.xlsx,.json"
                  class="hidden"
                  (change)="onFileSelected($event)"/>
                
                @if (uploadedFile(); as file) {
                  <div class="flex items-center justify-center gap-3">
                    <span class="material-icons text-4xl text-green-500">check_circle</span>
                    <div class="text-left">
                      <p class="font-medium text-gray-800 dark:text-white">{{ file.name }}</p>
                      <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
                    </div>
                    <button 
                      (click)="clearFile(); $event.stopPropagation()"
                      class="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg text-red-500">
                      <span class="material-icons">delete</span>
                    </button>
                  </div>
                } @else {
                  <span class="material-icons text-5xl text-gray-400 mb-3">cloud_upload</span>
                  <p class="text-gray-600 dark:text-gray-400 mb-2">Arrastre un archivo aquí o haga clic para seleccionar</p>
                  <p class="text-sm text-gray-400">Soporta: CSV, Excel, JSON</p>
                }
              </div>

              <!-- Manual Entry -->
              <div class="mt-6">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">O ingresar manualmente:</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input 
                    [(ngModel)]="manualName"
                    type="text" 
                    placeholder="Nombre completo"
                    class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"/>
                  <input 
                    [(ngModel)]="manualDocument"
                    type="text" 
                    placeholder="Documento"
                    class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"/>
                  <input 
                    [(ngModel)]="manualEmail"
                    type="email" 
                    placeholder="Email"
                    class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"/>
                  <input 
                    [(ngModel)]="manualGrade"
                    type="number" 
                    min="0" max="5" step="0.1"
                    placeholder="Nota (0-5)"
                    class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"/>
                </div>
                <button 
                  (click)="addManualEntry()"
                  class="mt-3 w-full py-2 border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <span class="material-icons">add</span>
                  Agregar a la Lista
                </button>
              </div>
            </div>

            <!-- Validation Results -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <span class="material-icons text-purple-500">fact_check</span>
                  3. Validación de Datos
                </h2>
                <span class="text-sm text-gray-500">{{ validationRecords().length }} registros</span>
              </div>
              
              <div class="max-h-[400px] overflow-y-auto">
                @if (validationRecords().length === 0) {
                  <div class="p-8 text-center text-gray-500">
                    <span class="material-icons text-4xl mb-2">playlist_add</span>
                    <p>No hay registros para validar</p>
                  </div>
                } @else {
                  <table class="w-full">
                    <thead class="bg-gray-50 dark:bg-slate-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                      <tr>
                        <th class="px-4 py-3">Nombre</th>
                        <th class="px-4 py-3">Documento</th>
                        <th class="px-4 py-3">Nota</th>
                        <th class="px-4 py-3">Estado</th>
                        <th class="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                      @for (record of validationRecords(); track $index) {
                        <tr class="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                          <td class="px-4 py-3">{{ record.nombre }}</td>
                          <td class="px-4 py-3 font-mono text-sm">{{ record.documento }}</td>
                          <td class="px-4 py-3">{{ record.nota }}</td>
                          <td class="px-4 py-3">
                            @if (record.valido) {
                              <span class="inline-flex items-center gap-1 text-green-600">
                                <span class="material-icons text-sm">check_circle</span>
                                Válido
                              </span>
                            } @else {
                              <span class="inline-flex items-center gap-1 text-red-600" [title]="record.error">
                                <span class="material-icons text-sm">error</span>
                                {{ record.error || 'Error' }}
                              </span>
                            }
                          </td>
                          <td class="px-4 py-3 text-right">
                            <button 
                              (click)="removeRecord($index)"
                              class="text-red-500 hover:text-red-700">
                              <span class="material-icons text-sm">delete</span>
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                }
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Summary Card -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sticky top-40">
              <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-6">Resumen de Emisión</h3>
              
              <div class="space-y-4 mb-6">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400">Total Registros</span>
                  <span class="text-xl font-bold text-gray-800 dark:text-white">{{ validationRecords().length }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400">Válidos</span>
                  <span class="text-xl font-bold text-green-600">{{ validRecords() }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400">Con Errores</span>
                  <span class="text-xl font-bold text-red-600">{{ invalidRecords() }}</span>
                </div>
              </div>

              <button 
                (click)="emitBadges()"
                [disabled]="!canEmit()"
                class="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <span class="material-icons">send</span>
                Emitir Insignias
              </button>

              @if (!canEmit()) {
                <p class="text-xs text-gray-500 mt-2 text-center">
                  Seleccione una insignia y agregue al menos un registro válido
                </p>
              }

              <!-- Recent Emissions -->
              <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Emisiones Recientes</h4>
                <div class="space-y-3">
                  @for (emission of recentEmissions(); track emission.id) {
                    <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span class="material-icons text-sm text-green-600">check</span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-800 dark:text-white truncate">{{ emission.badgeName }}</p>
                        <p class="text-xs text-gray-500">{{ emission.studentName }}</p>
                      </div>
                    </div>
                  } @empty {
                    <p class="text-sm text-gray-500 text-center">No hay emisiones recientes</p>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class AdminIssueComponent {
  private storageService = inject(StorageService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // File upload
  isDragging = signal(false);
  uploadedFile = signal<File | null>(null);

  // Manual entry
  manualName = signal('');
  manualDocument = signal('');
  manualEmail = signal('');
  manualGrade = signal('');

  // Selection
  selectedBadgeId = signal('');
  validationRecords = signal<ValidationRecord[]>([]);

  // Data
  currentUser = computed(() => this.storageService.currentUser());
  activeBadges = computed(() => this.storageService.badges().filter(b => b.status === 'Activo'));
  selectedBadge = computed(() => this.storageService.badges().find(b => b.id === this.selectedBadgeId()));
  
  // Stats
  validRecords = computed(() => this.validationRecords().filter(r => r.valido).length);
  invalidRecords = computed(() => this.validationRecords().filter(r => !r.valido).length);
  canEmit = computed(() => this.selectedBadgeId() && this.validRecords() > 0);
  
  // Recent emissions (last 5)
  recentEmissions = computed(() => {
    return this.storageService.issuedBadges()
      .slice(-5)
      .reverse();
  });

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    const validTypes = ['.csv', '.xlsx', '.json'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(extension)) {
      this.toastService.error('Formato de archivo no soportado. Use CSV, Excel o JSON');
      return;
    }

    this.uploadedFile.set(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (extension === '.json') {
          this.parseJSON(content);
        } else if (extension === '.csv') {
          this.parseCSV(content);
        } else {
          // For Excel, we'll simulate parsing
          this.simulateData();
        }
      } catch (error) {
        this.toastService.error('Error al leer el archivo');
      }
    };
    reader.readAsText(file);
  }

  parseJSON(content: string): void {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        this.processRecords(data);
      } else {
        this.toastService.error('El archivo JSON debe contener un array de registros');
      }
    } catch {
      this.toastService.error('JSON inválido');
    }
  }

  parseCSV(content: string): void {
    const lines = content.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const records = lines.slice(1).map(line => {
      const values = line.split(',');
      const record: any = {};
      headers.forEach((header, i) => {
        record[header] = values[i]?.trim();
      });
      return record;
    });

    this.processRecords(records);
  }

  simulateData(): void {
    // Simular datos de Excel
    const mockData = [
      { nombre: 'Ana María López', documento: '1012345678', email: 'ana@unal.edu.co', nota: '4.5' },
      { nombre: 'Carlos Rodríguez', documento: '1023456789', email: 'carlos@unal.edu.co', nota: '4.2' },
      { nombre: 'María Fernanda', documento: '1034567890', email: 'maria@unal.edu.co', nota: '3.8' },
    ];
    this.processRecords(mockData);
  }

  processRecords(data: any[]): void {
    const records: ValidationRecord[] = data.map(item => {
      const nota = parseFloat(item.nota || item.grade || item.calificacion);
      
      let error = '';
      if (!item.nombre && !item.name) error = 'Nombre requerido';
      else if (!item.documento && !item.document) error = 'Documento requerido';
      else if (!item.email) error = 'Email requerido';
      else if (isNaN(nota)) error = 'Nota inválida';
      else if (nota < 0 || nota > 5) error = 'Nota fuera de rango (0-5)';
      else if (nota < 3.0) error = 'Nota insuficiente (< 3.0)';

      return {
        nombre: item.nombre || item.name || '',
        documento: item.documento || item.document || '',
        email: item.email || '',
        nota: isNaN(nota) ? 0 : nota,
        valido: !error,
        error
      };
    });

    this.validationRecords.set(records);
    const validCount = records.filter(r => r.valido).length;
    this.toastService.success(`${validCount} de ${records.length} registros válidos`);
  }

  addManualEntry(): void {
    const name = this.manualName().trim();
    const doc = this.manualDocument().trim();
    const email = this.manualEmail().trim();
    const grade = parseFloat(this.manualGrade());

    if (!name || !doc || !email || isNaN(grade)) {
      this.toastService.error('Complete todos los campos');
      return;
    }

    let error = '';
    if (grade < 0 || grade > 5) error = 'Nota fuera de rango';
    else if (grade < 3.0) error = 'Nota insuficiente';

    const record: ValidationRecord = {
      nombre: name,
      documento: doc,
      email: email,
      nota: grade,
      valido: !error,
      error
    };

    this.validationRecords.update(records => [...records, record]);
    
    // Clear form
    this.manualName.set('');
    this.manualDocument.set('');
    this.manualEmail.set('');
    this.manualGrade.set('');

    if (record.valido) {
      this.toastService.success('Registro agregado');
    } else {
      this.toastService.warning('Registro agregado con error: ' + error);
    }
  }

  removeRecord(index: number): void {
    this.validationRecords.update(records => records.filter((_, i) => i !== index));
  }

  clearFile(): void {
    this.uploadedFile.set(null);
    this.validationRecords.set([]);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  emitBadges(): void {
    const badge = this.selectedBadge();
    if (!badge) {
      this.toastService.error('Seleccione una insignia');
      return;
    }

    const validRecords = this.validationRecords().filter(r => r.valido);
    if (validRecords.length === 0) {
      this.toastService.error('No hay registros válidos para emitir');
      return;
    }

    if (!confirm(`¿Emitir ${validRecords.length} insignias para "${badge.name}"?`)) {
      return;
    }

    // Emitir cada insignia
    let successCount = 0;
    for (const record of validRecords) {
      // Registrar o actualizar estudiante
      let student = this.storageService.getStudentByDocument(record.documento);
      if (!student) {
        student = this.storageService.addStudent({
          documentNumber: record.documento,
          fullName: record.nombre,
          email: record.email
        });
      }

      // Emitir insignia
      this.storageService.issueBadge({
        badgeId: badge.id,
        studentId: student.id,
        studentName: student.fullName,
        studentDocument: student.documentNumber,
        badgeName: badge.name,
        grade: record.nota,
        status: 'Válido'
      });

      successCount++;
    }

    this.toastService.success(`${successCount} insignias emitidas correctamente`);
    this.clearFile();
    this.selectedBadgeId.set('');
  }

  logout(): void {
    this.storageService.clearUser();
    this.toastService.info('Sesión cerrada');
    this.router.navigate(['/']);
  }
}
