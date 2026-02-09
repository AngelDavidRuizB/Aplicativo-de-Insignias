import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { PdfService } from '../services/pdf.service';
import { Badge, PALETTES, UNITS, ICONS } from '../models/badge.model';

@Component({
  selector: 'app-admin-catalog',
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
                <p class="text-sm text-purple-200">Gestión de Insignias</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="hidden sm:inline text-sm text-purple-200">{{ currentUser()?.name }}</span>
              <button 
                (click)="logout()"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Cerrar sesión">
                <span class="material-icons">logout</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Navigation -->
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
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <span class="material-icons text-purple-600 dark:text-purple-400">workspace_premium</span>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ totalBadges() }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Total Insignias</p>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <span class="material-icons text-green-600 dark:text-green-400">check_circle</span>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ activeBadges() }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Activas</p>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <span class="material-icons text-blue-600 dark:text-blue-400">verified</span>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ totalIssued() }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Emitidas</p>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
                <span class="material-icons text-amber-600 dark:text-amber-400">pending</span>
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ pendingBadges() }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Bar -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 mb-6">
          <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <!-- Search -->
            <div class="relative w-full lg:w-96">
              <span class="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input 
                [(ngModel)]="searchQuery"
                type="text" 
                placeholder="Buscar insignias..."
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"/>
            </div>

            <!-- Filters -->
            <div class="flex gap-2 flex-wrap">
              <select [(ngModel)]="filterStatus" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                <option value="">Todos los estados</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Pendiente">Pendiente</option>
              </select>
              <select [(ngModel)]="filterUnit" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                <option value="">Todas las unidades</option>
                @for (unit of units; track unit) {
                  <option [value]="unit">{{ unit }}</option>
                }
              </select>

            </div>

            <!-- Buttons -->
            <div class="flex gap-2">
              <button 
                (click)="exportData()"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2">
                <span class="material-icons text-sm">download</span>
                Exportar
              </button>
              <button 
                (click)="openModal()"
                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2">
                <span class="material-icons text-sm">add</span>
                Nueva Insignia
              </button>
            </div>
          </div>
        </div>

        <!-- Badges Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (badge of filteredBadges(); track badge.id) {
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <!-- Card Header with Color -->
              <div class="h-2" [class]="getPaletteColor(badge.colorTheme)"></div>
              
              <div class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-14 h-14 rounded-xl flex items-center justify-center"
                       [class]="getPaletteBg(badge.colorTheme)">
                    <span class="material-icons text-2xl" [class]="getPaletteText(badge.colorTheme)">{{ badge.icon }}</span>
                  </div>
                  <span class="px-3 py-1 rounded-full text-xs font-semibold"
                        [class.bg-green-100]="badge.status === 'Activo'"
                        [class.text-green-800]="badge.status === 'Activo'"
                        [class.bg-gray-100]="badge.status === 'Inactivo'"
                        [class.text-gray-800]="badge.status === 'Inactivo'"
                        [class.bg-amber-100]="badge.status === 'Pendiente'"
                        [class.text-amber-800]="badge.status === 'Pendiente'"
                        [class.dark:bg-opacity-20]="true">
                    {{ badge.status }}
                  </span>
                </div>

                <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-1">{{ badge.name }}</h3>

                <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span class="flex items-center gap-1">
                    <span class="material-icons text-sm">business</span>
                    {{ badge.unit }}
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="material-icons text-sm">schedule</span>
                    {{ badge.hours }}h
                  </span>
                </div>

                <div class="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    (click)="openModal(badge)"
                    class="flex-1 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors flex items-center justify-center gap-1">
                    <span class="material-icons text-sm">edit</span>
                    Editar
                  </button>
                  <button 
                    (click)="deleteBadge(badge)"
                    class="flex-1 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center justify-center gap-1">
                    <span class="material-icons text-sm">delete</span>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          } @empty {
            <div class="col-span-full text-center py-12">
              <span class="material-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
              <p class="text-gray-500 dark:text-gray-400">No se encontraron insignias</p>
            </div>
          }
        </div>
      </main>

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="closeModal()"></div>
          
          <div class="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                {{ isEditing() ? 'Editar Insignia' : 'Nueva Insignia' }}
              </h2>
              <button (click)="closeModal()" class="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <span class="material-icons">close</span>
              </button>
            </div>

            <div class="p-6 space-y-6">
              <!-- Preview -->
              <div class="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-6">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Vista Previa</p>
                <div class="flex items-center gap-4">
                  <div class="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                       [class]="getPaletteBg(selectedPalette())">
                    <span class="material-icons text-4xl" [class]="getPaletteText(selectedPalette())">{{ selectedIcon() }}</span>
                  </div>
                  <div>
                    <p class="font-bold text-gray-800 dark:text-white text-lg">{{ badgeName() || 'Título del Curso' }}</p>
                  </div>
                </div>
              </div>

              <!-- Form -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título del Curso *</label>
                  <input [(ngModel)]="badgeName" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"/>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unidad *</label>
                  <select [(ngModel)]="badgeUnit" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none">
                    @for (unit of units; track unit) {
                      <option [value]="unit">{{ unit }}</option>
                    }
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horas *</label>
                  <input [(ngModel)]="badgeHours" type="number" min="1" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none"/>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado *</label>
                  <select [(ngModel)]="badgeStatus" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none">
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icono</label>
                  <div class="grid grid-cols-5 gap-2">
                    @for (icon of icons; track icon.name) {
                      <button 
                        (click)="selectedIcon.set(icon.name)"
                        class="p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1"
                        [class.border-purple-500]="selectedIcon() === icon.name"
                        [class.bg-purple-50]="selectedIcon() === icon.name"
                        [class.dark:bg-purple-900/20]="selectedIcon() === icon.name"
                        [class.border-gray-200]="selectedIcon() !== icon.name"
                        [class.dark:border-gray-600]="selectedIcon() !== icon.name">
                        <span class="material-icons">{{ icon.name }}</span>
                        <span class="text-[10px] truncate w-full text-center">{{ icon.label }}</span>
                      </button>
                    }
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tema de Color</label>
                  <div class="grid grid-cols-4 gap-2">
                    @for (palette of palettes; track palette.id) {
                      <button 
                        (click)="selectedPalette.set(palette.id)"
                        class="p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2"
                        [class.border-purple-500]="selectedPalette() === palette.id"
                        [class.bg-purple-50]="selectedPalette() === palette.id"
                        [class.dark:bg-purple-900/20]="selectedPalette() === palette.id"
                        [class.border-gray-200]="selectedPalette() !== palette.id"
                        [class.dark:border-gray-600]="selectedPalette() !== palette.id">
                        <div class="w-8 h-8 rounded-full" [class]="palette.bg"></div>
                        <span class="text-[10px]">{{ palette.name }}</span>
                      </button>
                    }
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                  <textarea [(ngModel)]="badgeDescription" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-purple-500 outline-none resize-none"></textarea>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagen Informativa del Curso</label>
                  <div class="flex flex-col gap-3">
                    <input 
                      type="file" 
                      accept="image/*"
                      (change)="onImageSelected($event)"
                      class="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-purple-50 file:text-purple-700
                        dark:file:bg-purple-900/20 dark:file:text-purple-300
                        hover:file:bg-purple-100 dark:hover:file:bg-purple-900/30
                        file:cursor-pointer file:transition-colors"/>
                    
                    @if (badgeImagePreview()) {
                      <div class="relative mt-2">
                        <img [src]="badgeImagePreview()" alt="Preview" class="max-h-48 rounded-lg border border-gray-300 dark:border-gray-600"/>
                        <button 
                          (click)="removeImage()"
                          class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          title="Eliminar imagen">
                          <span class="material-icons text-sm">close</span>
                        </button>
                      </div>
                    }
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Esta imagen se mostrará a los estudiantes cuando vean los detalles del curso.</p>
                </div>
              </div>
            </div>

            <div class="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
              <button (click)="closeModal()" class="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                Cancelar
              </button>
              <button 
                (click)="saveBadge()"
                [disabled]="!isFormValid()"
                class="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2">
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

  // Datos constantes
  palettes = PALETTES;
  units = UNITS;
  icons = ICONS;

  // Signals para filtros
  searchQuery = signal('');
  filterStatus = signal('');
  filterUnit = signal('');

  // Signals para modal
  showModal = signal(false);
  isEditing = signal(false);
  editingId = signal<string | null>(null);

  // Form signals
  badgeName = signal('');
  badgeUnit = signal('UIFCE');
  badgeHours = signal(20);
  badgeStatus = signal<'Activo' | 'Inactivo' | 'Pendiente'>('Activo');
  badgeDescription = signal('');
  badgeImage = signal<string | null>(null);
  badgeImagePreview = signal<string | null>(null);
  selectedIcon = signal('workspace_premium');
  selectedPalette = signal('uifce');

  // Stats
  totalBadges = computed(() => this.storageService.badges().length);
  activeBadges = computed(() => this.storageService.badges().filter(b => b.status === 'Activo').length);
  pendingBadges = computed(() => this.storageService.badges().filter(b => b.status === 'Pendiente').length);
  totalIssued = computed(() => this.storageService.issuedBadges().length);
  currentUser = computed(() => this.storageService.currentUser());

  // Filtered badges
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
