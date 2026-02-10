import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { IssuedBadge, Badge } from '../models/badge.model';
import { HeaderComponent } from '../components/header.component';

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
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Header compartido -->
      <app-header 
        [userName]="currentUser()?.name || 'Administrador'"
        [userRole]="'Administrativo'"
        [showRoleSelector]="false"
        (logout)="logout()">
      </app-header>

      <!-- Navigation -->
      <nav class="bg-white border-b border-gray-200">
        <div class="container mx-auto px-4">
          <div class="flex gap-1 py-3">
            <a routerLink="/admin/catalog" 
               class="px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors whitespace-nowrap flex items-center gap-2 text-[#6a1b9a] border border-[#6a1b9a]/30">
              <span class="material-icons text-sm">workspace_premium</span>
              Catálogo
            </a>
            <a routerLink="/admin/issue" 
               class="px-5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 bg-[#6a1b9a] text-white hover:bg-[#5a1090] shadow-sm">
              <span class="material-icons text-sm">send</span>
              Emitir
            </a>
            <a routerLink="/" 
               class="px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap flex items-center gap-2 ml-auto text-gray-700">
              <span class="material-icons text-sm">public</span>
              Portal Público
            </a>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 container mx-auto px-4 py-8">
        <!-- Header Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 class="text-2xl font-bold text-admin-primary mb-1">Emisión Masiva de Insignias</h1>
              <p class="text-gray-500 text-sm">Cargue un archivo Excel para procesar y emitir certificados de forma masiva.</p>
            </div>
            <button 
              routerLink="/admin/catalog"
              class="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
              <span class="material-icons">arrow_back</span>
              Volver al Catálogo
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Badge Selection -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="material-icons text-admin-primary">workspace_premium</span>
                1. Seleccionar Insignia
              </h2>
              <select 
                [(ngModel)]="selectedBadgeId"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-admin-primary outline-none text-gray-800">
                <option value="">Seleccione una insignia...</option>
                @for (badge of activeBadges(); track badge.id) {
                  <option [value]="badge.id">{{ badge.name }}</option>
                }
              </select>
              
              @if (selectedBadge(); as badge) {
                <div class="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center" 
                         [class]="'bg-' + badge.colorTheme + '-100'">
                      <span class="material-icons" [class]="'text-' + badge.colorTheme + '-600'">{{ badge.icon }}</span>
                    </div>
                    <div>
                      <p class="font-bold text-gray-800">{{ badge.name }}</p>
                      <p class="text-sm text-gray-600">{{ badge.hours }} horas</p>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- File Upload -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span class="material-icons text-admin-primary">upload_file</span>
                2. Cargar Lista de Estudiantes
              </h2>
              
              <!-- Drop Zone -->
              <div 
                (drop)="onDrop($event)"
                (dragover)="onDragOver($event)"
                (dragleave)="onDragLeave($event)"
                [class.border-admin-primary]="isDragging()"
                [class.bg-purple-50]="isDragging()"
                class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-admin-primary transition-colors cursor-pointer"
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
                      <p class="font-medium text-gray-800">{{ file.name }}</p>
                      <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
                    </div>
                    <button 
                      (click)="clearFile(); $event.stopPropagation()"
                      class="p-2 hover:bg-red-100 rounded-lg text-red-500">
                      <span class="material-icons">delete</span>
                    </button>
                  </div>
                } @else {
                  <span class="material-icons text-5xl text-gray-400 mb-3">cloud_upload</span>
                  <p class="text-gray-600 mb-2">Arrastre un archivo aquí o haga clic para seleccionar</p>
                  <p class="text-sm text-gray-400">Soporta: CSV, Excel, JSON</p>
                }
              </div>

              <!-- Plantilla -->
              <div class="mt-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div class="p-2 bg-purple-50 rounded">
                  <span class="material-icons text-admin-primary">info</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-800">Plantilla Requerida</p>
                  <p class="text-xs text-gray-500">Asegúrese de usar el formato correcto para evitar errores.</p>
                </div>
                <button class="text-sm font-medium text-admin-primary hover:text-purple-800 flex items-center gap-1 border border-purple-200 px-3 py-1.5 rounded bg-purple-50">
                  <span class="material-icons text-base">download</span>
                  Descargar Plantilla
                </button>
              </div>

              <!-- Manual Entry -->
              <div class="mt-6 pt-6 border-t border-gray-100">
                <p class="text-sm font-medium text-gray-700 mb-3">O ingresar manualmente:</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input 
                    [(ngModel)]="manualName"
                    type="text" 
                    placeholder="Nombre completo"
                    class="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-admin-primary outline-none text-gray-800"/>
                  <input 
                    [(ngModel)]="manualDocument"
                    type="text" 
                    placeholder="Documento"
                    class="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-admin-primary outline-none text-gray-800"/>
                  <input 
                    [(ngModel)]="manualEmail"
                    type="email" 
                    placeholder="Email"
                    class="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-admin-primary outline-none text-gray-800"/>
                  <input 
                    [(ngModel)]="manualGrade"
                    type="number" 
                    min="0" max="5" step="0.1"
                    placeholder="Nota (0-5)"
                    class="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-admin-primary outline-none text-gray-800"/>
                </div>
                <button 
                  (click)="addManualEntry()"
                  class="mt-3 w-full py-2 border border-admin-primary text-admin-primary hover:bg-purple-50 rounded-lg font-medium flex items-center justify-center gap-2">
                  <span class="material-icons">add</span>
                  Agregar a la Lista
                </button>
              </div>
            </div>

            <!-- Validation Results -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <h3 class="font-bold text-gray-800 flex items-center gap-2">
                  <span class="material-icons text-gray-400">assignment</span>
                  3. Registro de Validación
                </h3>
                <span 
                  [class.bg-yellow-100]="validationRecords().length === 0"
                  [class.text-yellow-800]="validationRecords().length === 0"
                  [class.bg-blue-100]="validationRecords().length > 0 && !allValidated()"
                  [class.text-blue-800]="validationRecords().length > 0 && !allValidated()"
                  [class.bg-green-100]="allValidated()"
                  [class.text-green-800]="allValidated()"
                  class="text-xs font-medium px-3 py-1 rounded-full">
                  {{ validationRecords().length === 0 ? 'Pendiente de carga' : allValidated() ? 'Validado' : 'Procesando...' }}
                </span>
              </div>
              
              <div class="max-h-[400px] overflow-y-auto">
                @if (validationRecords().length === 0) {
                  <div class="p-12 text-center text-gray-400">
                    <span class="material-icons text-4xl mb-2 opacity-50">playlist_add</span>
                    <p class="text-sm">Los detalles del procesamiento aparecerán aquí una vez cargado el archivo.</p>
                  </div>
                } @else {
                  <table class="w-full text-sm text-left">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                      <tr>
                        <th class="px-6 py-3">Nombre</th>
                        <th class="px-6 py-3">Documento</th>
                        <th class="px-6 py-3">Nota</th>
                        <th class="px-6 py-3">Estado</th>
                        <th class="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      @for (record of validationRecords(); track $index) {
                        <tr class="hover:bg-gray-50">
                          <td class="px-6 py-3">{{ record.nombre }}</td>
                          <td class="px-6 py-3 font-mono text-sm">{{ record.documento }}</td>
                          <td class="px-6 py-3">{{ record.nota }}</td>
                          <td class="px-6 py-3">
                            @if (record.valido) {
                              <span class="inline-flex items-center gap-1 text-green-600 font-semibold">
                                <span class="material-icons text-sm">check_circle</span>
                                OK
                              </span>
                            } @else {
                              <span class="inline-flex items-center gap-1 text-red-600 font-semibold" [title]="record.error">
                                <span class="material-icons text-sm">error</span>
                                Error
                              </span>
                            }
                          </td>
                          <td class="px-6 py-3 text-right">
                            <button 
                              (click)="removeRecord($index)"
                              class="text-gray-400 hover:text-red-500">
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
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-40">
              <h3 class="text-lg font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Acciones</h3>
              
              <div class="space-y-4 mb-6">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Registros Totales:</span>
                  <span class="font-medium text-gray-900">{{ validationRecords().length }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Registros Válidos:</span>
                  <span class="font-medium text-green-600">{{ validRecords() }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Con Errores:</span>
                  <span class="font-medium text-red-600">{{ invalidRecords() }}</span>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200">
                <button 
                  (click)="emitBadges()"
                  [disabled]="!canEmit()"
                  class="w-full py-3 bg-admin-primary hover:bg-purple-800 disabled:bg-gray-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
                  <span class="material-icons">send</span>
                  Emitir Insignias Masivamente
                </button>
                @if (!canEmit()) {
                  <p class="text-xs text-center mt-2 text-gray-400">
                    El botón se habilitará cuando la validación sea exitosa.
                  </p>
                }
              </div>

              <!-- Instructions -->
              <div class="mt-6 bg-purple-50 rounded-lg p-4 border border-purple-100">
                <h4 class="font-bold text-admin-primary mb-3 flex items-center gap-2">
                  <span class="material-icons">lightbulb</span>
                  Instrucciones
                </h4>
                <ul class="text-sm space-y-2 text-gray-700 list-disc list-inside">
                  <li>El archivo debe contener: <strong>Documento, Nombre, Email, Nota</strong></li>
                  <li>La nota debe ser numérica (0.0 a 5.0)</li>
                  <li>El sistema notificará automáticamente por correo</li>
                  <li>Las insignias se generarán en formato Open Badges 2.0</li>
                </ul>
              </div>

              <!-- Recent Emissions -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <h4 class="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Cargas Recientes</h4>
                <div class="space-y-3">
                  @for (emission of recentEmissions(); track emission.id) {
                    <div class="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <div class="mt-0.5 p-1.5 bg-green-100 rounded text-green-600">
                        <span class="material-icons text-sm">check</span>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-800">{{ emission.badgeName }}</p>
                        <p class="text-xs text-gray-500">{{ emission.studentName }}</p>
                      </div>
                    </div>
                  } @empty {
                    <p class="text-sm text-gray-500 text-center py-4">No hay emisiones recientes</p>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 mt-auto">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <div>
              <p>© 2024 UIFCE - Facultad de Ciencias Económicas. Universidad Nacional de Colombia.</p>
            </div>
            <div class="flex space-x-6">
              <a class="hover:text-admin-primary" href="#">Términos y condiciones</a>
              <a class="hover:text-admin-primary" href="#">Política de Privacidad</a>
              <a class="hover:text-admin-primary" href="#">Soporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AdminIssueComponent {
  private storageService = inject(StorageService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isDragging = signal(false);
  uploadedFile = signal<File | null>(null);

  manualName = signal('');
  manualDocument = signal('');
  manualEmail = signal('');
  manualGrade = signal('');

  selectedBadgeId = signal('');
  validationRecords = signal<ValidationRecord[]>([]);

  currentUser = computed(() => this.storageService.currentUser());
  activeBadges = computed(() => this.storageService.badges().filter(b => b.status === 'Activo'));
  selectedBadge = computed(() => this.storageService.badges().find(b => b.id === this.selectedBadgeId()));
  
  validRecords = computed(() => this.validationRecords().filter(r => r.valido).length);
  invalidRecords = computed(() => this.validationRecords().filter(r => !r.valido).length);
  canEmit = computed(() => this.selectedBadgeId() && this.validRecords() > 0);
  allValidated = computed(() => this.validationRecords().length > 0 && this.validRecords() === this.validationRecords().length);
  
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

    let successCount = 0;
    for (const record of validRecords) {
      let student = this.storageService.getStudentByDocument(record.documento);
      if (!student) {
        student = this.storageService.addStudent({
          documentNumber: record.documento,
          fullName: record.nombre,
          email: record.email
        });
      }

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
