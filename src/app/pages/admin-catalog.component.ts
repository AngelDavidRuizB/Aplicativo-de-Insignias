import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { PdfService } from '../services/pdf.service';
import { Badge, PALETTES, UNITS, ICONS } from '../models/badge.model';
import { HeaderComponent } from '../components/header.component';

@Component({
  selector: 'app-admin-catalog',
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
               class="px-5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 bg-[#6a1b9a] text-white hover:bg-[#5a1090] shadow-sm">
              <span class="material-icons text-sm">workspace_premium</span>
              Catálogo
            </a>
            <a routerLink="/admin/issue" 
               routerLinkActive="bg-admin-primary text-white"
               class="px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap flex items-center gap-2 text-gray-700">
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
              <h1 class="text-2xl font-bold text-admin-primary mb-1">Administrar Catálogo de Insignias</h1>
              <p class="text-gray-500 text-sm">Gestiona la oferta de insignias digitales y certificaciones disponibles.</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3 mt-6">
            <button 
              class="flex items-center gap-2 px-4 py-2 border-2 border-admin-primary text-admin-primary rounded-lg font-semibold hover:bg-purple-50">
              <span class="material-icons">verified</span>
              Insignias Base
            </button>
            <button 
              (click)="openModal()"
              class="flex items-center gap-2 px-4 py-2 bg-admin-primary text-white rounded-lg font-semibold hover:bg-purple-800">
              <span class="material-icons">add</span>
              Crear Nueva Insignia
            </button>
            <button 
              routerLink="/admin/issue"
              class="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
              <span class="material-icons">upload_file</span>
              Emisión Masiva
            </button>
            <button 
              class="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 ml-auto">
              <span class="material-icons">settings</span>
              Configuración
            </button>
          </div>

          <!-- Filters -->
          <div class="flex flex-col lg:flex-row gap-4 mt-6 pt-6 border-t border-gray-100">
            <!-- Status Filters -->
            <div class="flex gap-2 flex-wrap">
              <button 
                (click)="filterStatus.set('')"
                class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                [class.bg-admin-primary]="filterStatus() === ''"
                [class.text-white]="filterStatus() === ''"
                [class.border-admin-primary]="filterStatus() === ''"
                [class.bg-white]="filterStatus() !== ''"
                [class.text-gray-700]="filterStatus() !== ''"
                [class.border-gray-300]="filterStatus() !== ''">
                Todos
              </button>
              <button 
                (click)="filterStatus.set('Activo')"
                class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                [class.bg-admin-primary]="filterStatus() === 'Activo'"
                [class.text-white]="filterStatus() === 'Activo'"
                [class.border-admin-primary]="filterStatus() === 'Activo'"
                [class.bg-white]="filterStatus() !== 'Activo'"
                [class.text-gray-700]="filterStatus() !== 'Activo'"
                [class.border-gray-300]="filterStatus() !== 'Activo'">
                Activos
              </button>
              <button 
                (click)="filterStatus.set('Inactivo')"
                class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                [class.bg-admin-primary]="filterStatus() === 'Inactivo'"
                [class.text-white]="filterStatus() === 'Inactivo'"
                [class.border-admin-primary]="filterStatus() === 'Inactivo'"
                [class.bg-white]="filterStatus() !== 'Inactivo'"
                [class.text-gray-700]="filterStatus() !== 'Inactivo'"
                [class.border-gray-300]="filterStatus() !== 'Inactivo'">
                Inactivos
              </button>
              <button 
                (click)="filterStatus.set('Pendiente')"
                class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                [class.bg-admin-primary]="filterStatus() === 'Pendiente'"
                [class.text-white]="filterStatus() === 'Pendiente'"
                [class.border-admin-primary]="filterStatus() === 'Pendiente'"
                [class.bg-white]="filterStatus() !== 'Pendiente'"
                [class.text-gray-700]="filterStatus() !== 'Pendiente'"
                [class.border-gray-300]="filterStatus() !== 'Pendiente'">
                Pendientes
              </button>
            </div>

            <!-- Unit Filter -->
            <div class="flex gap-2">
              <select [(ngModel)]="filterUnit" class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-admin-primary outline-none text-gray-700">
                <option value="">Todas las unidades</option>
                @for (unit of units; track unit) {
                  <option [value]="unit">{{ unit }}</option>
                }
              </select>
            </div>

            <!-- Search -->
            <div class="relative flex-1 lg:max-w-md lg:ml-auto">
              <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input 
                [(ngModel)]="searchQuery"
                type="text" 
                placeholder="Buscar por nombre, código o ID..."
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-admin-primary outline-none"/>
            </div>
          </div>
        </div>

        <!-- Badges Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-800">Listado de Insignias</h3>
            <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Total: {{ filteredBadges().length }}</span>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-purple-50 text-gray-600 text-xs uppercase tracking-wider font-semibold border-b border-purple-100">
                  <th class="px-6 py-4">Insignia</th>
                  <th class="px-6 py-4">UUID / ID Referencia</th>
                  <th class="px-6 py-4">Curso Asociado</th>
                  <th class="px-6 py-4">Unidad Emisora</th>
                  <th class="px-6 py-4 text-center">Horas</th>
                  <th class="px-6 py-4 text-center">Estado</th>
                  <th class="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 text-sm">
                @if (filteredBadges().length === 0) {
                  <tr>
                    <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                      <span class="material-icons text-4xl mb-2 opacity-50">search_off</span>
                      <p>No se encontraron insignias que coincidan con los filtros seleccionados.</p>
                    </td>
                  </tr>
                }
                @for (badge of filteredBadges(); track badge.id) {
                  <tr class="hover:bg-purple-50/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center" 
                             [class]="getPaletteBg(badge.colorTheme)">
                          <span class="material-icons" [class]="getPaletteText(badge.colorTheme)">{{ badge.icon }}</span>
                        </div>
                        <div>
                          <div class="font-bold text-gray-900">{{ badge.name }}</div>
                          <div class="text-xs text-gray-500">{{ badge.description || 'Sin descripción' }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ badge.id.toUpperCase() }}</td>
                    <td class="px-6 py-4 text-gray-700">{{ badge.name }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {{ badge.unit }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center text-gray-600">{{ badge.hours }}h</td>
                    <td class="px-6 py-4 text-center">
                      <span class="px-3 py-1 text-xs font-semibold rounded-full" 
                        [class.bg-green-100]="badge.status === 'Activo'"
                        [class.text-green-800]="badge.status === 'Activo'"
                        [class.bg-gray-100]="badge.status === 'Inactivo'"
                        [class.text-gray-600]="badge.status === 'Inactivo'"
                        [class.bg-purple-100]="badge.status === 'Pendiente'"
                        [class.text-purple-800]="badge.status === 'Pendiente'">
                        {{ badge.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button 
                        (click)="openModal(badge)"
                        class="text-gray-400 hover:text-admin-primary transition-colors p-1"
                        title="Editar insignia">
                        <span class="material-icons text-base">edit</span>
                      </button>
                      <button 
                        (click)="deleteBadge(badge)"
                        class="text-gray-400 hover:text-red-500 transition-colors p-1 ml-1">
                        <span class="material-icons text-base">delete</span>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
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

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50" (click)="closeModal()"></div>
          
          <div class="relative w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-800">
                {{ isEditing() ? 'Editar Insignia' : 'Nueva Insignia' }}
              </h2>
              <button (click)="closeModal()" class="p-2 hover:bg-gray-100 rounded-lg">
                <span class="material-icons">close</span>
              </button>
            </div>

            <div class="p-6 space-y-6">
              <!-- Preview -->
              <div class="bg-gray-50 rounded-lg p-6">
                <p class="text-sm font-medium text-gray-700 mb-4">Vista Previa</p>
                <div class="flex items-center gap-4">
                  <div class="w-20 h-20 rounded-xl flex items-center justify-center"
                       [class]="getPaletteBg(selectedPalette())">
                    <span class="material-icons text-4xl" [class]="getPaletteText(selectedPalette())">{{ selectedIcon() }}</span>
                  </div>
                  <div>
                    <p class="font-bold text-gray-800 text-lg">{{ badgeName() || 'Título del Curso' }}</p>
                  </div>
                </div>
              </div>

              <!-- Form -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Título del Curso *</label>
                  <input [(ngModel)]="badgeName" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-admin-primary outline-none"/>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Unidad *</label>
                  <select [(ngModel)]="badgeUnit" class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-admin-primary outline-none">
                    @for (unit of units; track unit) {
                      <option [value]="unit">{{ unit }}</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Horas *</label>
                  <input [(ngModel)]="badgeHours" type="number" min="1" class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-admin-primary outline-none"/>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                  <select [(ngModel)]="badgeStatus" class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-admin-primary outline-none">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea [(ngModel)]="badgeDescription" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-admin-primary outline-none resize-none"></textarea>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Icono</label>
                  <div class="grid grid-cols-5 gap-2">
                    @for (icon of icons; track icon.name) {
                      <button 
                        (click)="selectedIcon.set(icon.name)"
                        class="p-3 rounded-lg border-2 flex flex-col items-center gap-1"
                        [class.border-admin-primary]="selectedIcon() === icon.name"
                        [class.bg-purple-50]="selectedIcon() === icon.name"
                        [class.border-gray-200]="selectedIcon() !== icon.name">
                        <span class="material-icons">{{ icon.name }}</span>
                        <span class="text-[10px] truncate w-full text-center">{{ icon.label }}</span>
                      </button>
                    }
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tema de Color</label>
                  <div class="grid grid-cols-4 gap-2">
                    @for (palette of palettes; track palette.id) {
                      <button 
                        (click)="selectedPalette.set(palette.id)"
                        class="p-3 rounded-lg border-2 flex flex-col items-center gap-2"
                        [class.border-admin-primary]="selectedPalette() === palette.id"
                        [class.bg-purple-50]="selectedPalette() === palette.id"
                        [class.border-gray-200]="selectedPalette() !== palette.id">
                        <div class="w-8 h-8 rounded-full" [class]="palette.bg"></div>
                        <span class="text-[10px]">{{ palette.name }}</span>
                      </button>
                    }
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Imagen Informativa del Curso</label>
                  <div class="flex flex-col gap-3">
                    <input 
                      type="file" 
                      accept="image/*"
                      (change)="onImageSelected($event)"
                      class="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-purple-50 file:text-purple-700
                        file:cursor-pointer"/>
                    
                    @if (badgeImagePreview()) {
                      <div class="relative mt-2">
                        <img [src]="badgeImagePreview()" alt="Preview" class="max-h-48 rounded-lg border border-gray-300"/>
                        <button 
                          (click)="removeImage()"
                          class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          title="Eliminar imagen">
                          <span class="material-icons text-sm">close</span>
                        </button>
                      </div>
                    }
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Esta imagen se mostrará a los estudiantes cuando vean los detalles del curso.</p>
                </div>
              </div>
            </div>

            <div class="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button (click)="closeModal()" class="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Cancelar
              </button>
              <button 
                (click)="saveBadge()"
                [disabled]="!isFormValid()"
                class="px-6 py-2 bg-admin-primary hover:bg-purple-800 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2">
                <span class="material-icons text-sm">save</span>
                {{ isEditing() ? 'Guardar Cambios' : 'Crear Insignia' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminCatalogComponent {
  private storageService = inject(StorageService);
  private toastService = inject(ToastService);
  private pdfService = inject(PdfService);
  private router = inject(Router);

  palettes = PALETTES;
  units = UNITS;
  icons = ICONS;

  searchQuery = signal('');
  filterStatus = signal('');
  filterUnit = signal('');

  showModal = signal(false);
  isEditing = signal(false);
  editingId = signal<string | null>(null);

  badgeName = signal('');
  badgeUnit = signal('UIFCE');
  badgeHours = signal(20);
  badgeStatus = signal<'Activo' | 'Inactivo' | 'Pendiente'>('Activo');
  badgeDescription = signal('');
  badgeImage = signal<string | null>(null);
  badgeImagePreview = signal<string | null>(null);
  selectedIcon = signal('workspace_premium');
  selectedPalette = signal('uifce');

  currentUser = computed(() => this.storageService.currentUser());

  filteredBadges = computed(() => {
    return this.storageService.badges().filter(badge => {
      const matchesSearch = !this.searchQuery() || 
        badge.name.toLowerCase().includes(this.searchQuery().toLowerCase());
      
      const matchesStatus = !this.filterStatus() || badge.status === this.filterStatus();
      const matchesUnit = !this.filterUnit() || badge.unit === this.filterUnit();

      return matchesSearch && matchesStatus && matchesUnit;
    });
  });

  openModal(badge?: Badge): void {
    if (badge) {
      this.isEditing.set(true);
      this.editingId.set(badge.id);
      this.badgeName.set(badge.name);
      this.badgeUnit.set(badge.unit);
      this.badgeHours.set(badge.hours);
      this.badgeStatus.set(badge.status);
      this.badgeDescription.set(badge.description);
      this.badgeImage.set(badge.image || null);
      this.badgeImagePreview.set(badge.image || null);
      this.selectedIcon.set(badge.icon);
      this.selectedPalette.set(badge.colorTheme);
    } else {
      this.resetForm();
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.badgeName.set('');
    this.badgeUnit.set('UIFCE');
    this.badgeHours.set(20);
    this.badgeStatus.set('Activo');
    this.badgeDescription.set('');
    this.badgeImage.set(null);
    this.badgeImagePreview.set(null);
    this.selectedIcon.set('workspace_premium');
    this.selectedPalette.set('uifce');
  }

  isFormValid(): boolean {
    return !!(
      this.badgeName().trim() &&
      this.badgeHours() > 0
    );
  }

  saveBadge(): void {
    if (!this.isFormValid()) return;

    const badgeData = {
      name: this.badgeName().trim(),
      unit: this.badgeUnit(),
      hours: this.badgeHours(),
      status: this.badgeStatus(),
      description: this.badgeDescription().trim(),
      icon: this.selectedIcon(),
      image: this.badgeImage() || undefined,
      colorTheme: this.selectedPalette()
    };

    if (this.isEditing() && this.editingId()) {
      this.storageService.updateBadge(this.editingId()!, badgeData);
      this.toastService.success('Insignia actualizada correctamente');
    } else {
      this.storageService.addBadge(badgeData);
      this.toastService.success('Insignia creada correctamente');
    }

    this.closeModal();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.badgeImage.set(result);
        this.badgeImagePreview.set(result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.badgeImage.set(null);
    this.badgeImagePreview.set(null);
  }

  deleteBadge(badge: Badge): void {
    if (confirm(`¿Está seguro de eliminar la insignia "${badge.name}"?`)) {
      if (this.storageService.deleteBadge(badge.id)) {
        this.toastService.success('Insignia eliminada correctamente');
      } else {
        this.toastService.error('No se pudo eliminar la insignia');
      }
    }
  }

  exportData(): void {
    const data = this.storageService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fce-badges-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toastService.success('Datos exportados correctamente');
  }

  logout(): void {
    this.storageService.clearUser();
    this.toastService.info('Sesión cerrada');
    this.router.navigate(['/']);
  }

  getPaletteColor(theme: string): string {
    const palette = PALETTES.find(p => p.id === theme);
    return palette ? palette.bg : 'bg-purple-500';
  }

  getPaletteBg(theme: string): string {
    const palette = PALETTES.find(p => p.id === theme);
    return palette ? palette.lightBg : 'bg-purple-50';
  }

  getPaletteText(theme: string): string {
    const palette = PALETTES.find(p => p.id === theme);
    return palette ? palette.text : 'text-purple-600';
  }
}
