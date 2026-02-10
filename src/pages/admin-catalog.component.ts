
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../app/components/header.component';

const PALETTES = [
  { id: 'tech', name: 'Tecnología', iconBg: 'bg-indigo-100 dark:bg-indigo-900', iconColor: 'text-indigo-600 dark:text-indigo-300', ring: 'ring-indigo-500' },
  { id: 'finance', name: 'Finanzas', iconBg: 'bg-emerald-100 dark:bg-emerald-900', iconColor: 'text-emerald-600 dark:text-emerald-300', ring: 'ring-emerald-500' },
  { id: 'management', name: 'Gestión', iconBg: 'bg-blue-100 dark:bg-blue-900', iconColor: 'text-blue-600 dark:text-blue-300', ring: 'ring-blue-500' },
  { id: 'creative', name: 'Creativo', iconBg: 'bg-pink-100 dark:bg-pink-900', iconColor: 'text-pink-600 dark:text-pink-300', ring: 'ring-pink-500' },
  { id: 'expert', name: 'Experto', iconBg: 'bg-amber-100 dark:bg-amber-900', iconColor: 'text-amber-600 dark:text-amber-300', ring: 'ring-amber-500' },
  { id: 'data', name: 'Datos', iconBg: 'bg-cyan-100 dark:bg-cyan-900', iconColor: 'text-cyan-600 dark:text-cyan-300', ring: 'ring-cyan-500' },
  { id: 'basic', name: 'Básico', iconBg: 'bg-slate-100 dark:bg-slate-800', iconColor: 'text-slate-600 dark:text-slate-300', ring: 'ring-slate-500' },
  { id: 'uifce', name: 'Institucional', iconBg: 'bg-purple-100 dark:bg-purple-900', iconColor: 'text-purple-600 dark:text-purple-300', ring: 'ring-purple-500' },
];

@Component({
  selector: 'app-admin-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="font-display text-gray-800 dark:text-gray-100 min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <!-- Header compartido -->
      <app-header 
        [userName]="'Ángel David'"
        [userRole]="'Administrativo'"
        [showRoleSelector]="false">
      </app-header>

      <main class="flex-grow container mx-auto px-4 py-8">
        <section class="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 class="text-2xl font-bold text-admin-primary dark:text-purple-300 mb-1">Administrar Catálogo de Insignias</h2>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Gestiona la oferta de insignias digitales y certificaciones disponibles.</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-4 mb-6">
            <button class="flex items-center space-x-2 bg-white dark:bg-gray-800 border-2 border-admin-primary dark:border-purple-500 text-admin-primary dark:text-purple-300 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
              <span class="material-icons">verified</span>
              <span>Insignias Base</span>
            </button>
            <button 
              (click)="openModal()"
              class="flex items-center space-x-2 bg-admin-primary text-white border-2 border-admin-primary px-4 py-2 rounded-lg font-semibold hover:bg-purple-900 transition-colors shadow-md">
              <span class="material-icons">add</span>
              <span>Crear Nueva Insignia</span>
            </button>
             <button routerLink="/admin/issue" class="flex items-center space-x-2 bg-purple-100 dark:bg-gray-700 border border-purple-200 text-purple-700 dark:text-purple-200 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-gray-600 transition-colors shadow-sm">
              <span class="material-icons">upload_file</span>
              <span>Emisión Masiva</span>
            </button>
            <button class="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm ml-auto">
              <span class="material-icons">settings</span>
              <span>Configuración</span>
            </button>
          </div>

          <div class="flex flex-col xl:flex-row gap-4 items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <!-- Filter Group: Status -->
            <div class="flex flex-wrap gap-2 w-full xl:w-auto items-center">
              <div class="flex flex-wrap gap-2">
                @for (status of ['Todos', 'Activo', 'Inactivo', 'Pendiente', 'Archivado']; track status) {
                    <button 
                        (click)="setStatus(status)"
                        class="px-3 py-1.5 text-xs font-medium rounded-md border transition-colors"
                        [class.bg-admin-primary]="selectedStatus() === status"
                        [class.text-white]="selectedStatus() === status"
                        [class.border-admin-primary]="selectedStatus() === status"
                        [class.bg-white]="selectedStatus() !== status"
                        [class.dark:bg-gray-700]="selectedStatus() !== status"
                        [class.text-gray-600]="selectedStatus() !== status"
                        [class.dark:text-gray-300]="selectedStatus() !== status"
                        [class.border-gray-200]="selectedStatus() !== status"
                        [class.dark:border-gray-600]="selectedStatus() !== status"
                        [class.hover:bg-gray-50]="selectedStatus() !== status"
                        [class.dark:hover:bg-gray-600]="selectedStatus() !== status">
                        {{ status === 'Activo' ? 'Activos' : status === 'Inactivo' ? 'Inactivos' : status === 'Pendiente' ? 'Pendientes' : status === 'Archivado' ? 'Archivados' : 'Todos' }}
                    </button>
                }
              </div>
              
              <div class="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

              <!-- Filter Group: Dropdowns -->
               <div class="flex gap-2 flex-grow sm:flex-grow-0">
                  <div class="relative min-w-[140px] flex-grow sm:flex-grow-0">
                    <select 
                      [value]="selectedUnit()"
                      (change)="updateUnit($event)"
                      class="w-full pl-3 pr-8 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-admin-primary outline-none cursor-pointer appearance-none transition-colors">
                      <option value="">Todas las Unidades</option>
                      @for (unit of units(); track unit) {
                        <option [value]="unit">{{ unit }}</option>
                      }
                    </select>
                    <span class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400 flex items-center">
                      <span class="material-icons text-sm">expand_more</span>
                    </span>
                  </div>

                  <div class="relative min-w-[140px] flex-grow sm:flex-grow-0">
                    <select 
                      [value]="selectedLevel()"
                      (change)="updateLevel($event)"
                      class="w-full pl-3 pr-8 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-admin-primary outline-none cursor-pointer appearance-none transition-colors">
                      <option value="">Todos los Niveles</option>
                      @for (level of levels(); track level) {
                        <option [value]="level">{{ level }}</option>
                      }
                    </select>
                    <span class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400 flex items-center">
                      <span class="material-icons text-sm">expand_more</span>
                    </span>
                  </div>
               </div>
            </div>

            <!-- Search -->
            <div class="relative w-full xl:w-80">
              <input 
                [value]="searchQuery()"
                (input)="updateSearch($event)"
                class="w-full pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-admin-primary focus:border-transparent dark:text-white placeholder-gray-400 outline-none transition-shadow" 
                placeholder="Buscar por nombre, curso, unidad o ID..." 
                type="text"/>
              <button class="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-admin-primary dark:text-gray-400">
                <span class="material-icons text-xl">search</span>
              </button>
            </div>
          </div>
        </section>

        <section class="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">Listado de Insignias</h3>
            <span class="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">Total: {{ totalItems() }}</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-purple-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider font-semibold border-b border-purple-100 dark:border-gray-700">
                  <th class="px-6 py-4 cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors select-none" (click)="toggleSort('name')">
                    <div class="flex items-center gap-1">
                        Insignia
                        @if (sortColumn() === 'name') {
                            <span class="material-icons text-sm">{{ sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</span>
                        }
                    </div>
                  </th>
                  <th class="px-6 py-4">UUID / ID Referencia</th>
                  <th class="px-6 py-4 cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors select-none" (click)="toggleSort('course')">
                    <div class="flex items-center gap-1">
                        Curso Asociado
                        @if (sortColumn() === 'course') {
                            <span class="material-icons text-sm">{{ sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</span>
                        }
                    </div>
                  </th>
                  <th class="px-6 py-4 cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors select-none" (click)="toggleSort('unit')">
                     <div class="flex items-center gap-1">
                        Unidad Emisora
                        @if (sortColumn() === 'unit') {
                            <span class="material-icons text-sm">{{ sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</span>
                        }
                    </div>
                  </th>
                  <th class="px-6 py-4 text-center cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors select-none" (click)="toggleSort('hours')">
                    <div class="flex items-center justify-center gap-1">
                        Horas
                        @if (sortColumn() === 'hours') {
                            <span class="material-icons text-sm">{{ sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</span>
                        }
                    </div>
                  </th>
                  <th class="px-6 py-4 text-center cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors select-none" (click)="toggleSort('status')">
                     <div class="flex items-center justify-center gap-1">
                        Estado
                        @if (sortColumn() === 'status') {
                            <span class="material-icons text-sm">{{ sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward' }}</span>
                        }
                    </div>
                  </th>
                  <th class="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                @if (paginatedBadges().length === 0) {
                  <tr>
                    <td colspan="7" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <span class="material-icons text-4xl mb-2 opacity-50">search_off</span>
                      <p>No se encontraron insignias que coincidan con los filtros seleccionados.</p>
                    </td>
                  </tr>
                }
                @for (badge of paginatedBadges(); track badge.id) {
                  <tr class="hover:bg-purple-50/50 dark:hover:bg-gray-750 transition-colors group">
                    <td class="px-6 py-4">
                      <div class="flex items-center space-x-3">
                        <div class="h-10 w-10 rounded-full flex items-center justify-center transition-colors overflow-hidden relative" [class]="badge.iconBgClass + ' ' + badge.iconColorClass">
                          @if (badge.image) {
                            <img [src]="badge.image" alt="Badge Icon" class="w-full h-full object-cover">
                          } @else {
                            <span class="material-icons">{{badge.icon}}</span>
                          }
                        </div>
                        <div>
                          <div class="font-bold text-gray-900 dark:text-white">{{badge.name}}</div>
                          <div class="text-xs text-gray-500">{{badge.level}}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 font-mono text-xs text-gray-500">{{badge.uuid}}</td>
                    <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{badge.course}}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" [class]="badge.unitBgClass + ' ' + badge.unitColorClass">
                        {{badge.unit}}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center text-gray-600 dark:text-gray-400">{{badge.hours}}</td>
                    <td class="px-6 py-4 text-center">
                      <span class="px-2 py-1 text-xs font-semibold rounded-full border" 
                        [class.bg-green-100]="badge.status === 'Activo'"
                        [class.text-green-800]="badge.status === 'Activo'"
                        [class.border-green-200]="badge.status === 'Activo'"
                        [class.bg-gray-100]="badge.status === 'Inactivo'"
                        [class.text-gray-600]="badge.status === 'Inactivo'"
                        [class.border-gray-200]="badge.status === 'Inactivo'"
                        [class.bg-purple-50]="badge.status === 'Pendiente'"
                        [class.text-purple-800]="badge.status === 'Pendiente'"
                        [class.border-purple-200]="badge.status === 'Pendiente'">
                        {{badge.status}}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button 
                        (click)="openModal(badge)"
                        class="text-gray-400 hover:text-admin-primary dark:hover:text-purple-400 transition-colors p-1"
                        title="Editar insignia">
                        <span class="material-icons text-base">edit</span>
                      </button>
                      <button class="text-gray-400 hover:text-red-500 transition-colors p-1 ml-1 opacity-0 group-hover:opacity-100">
                        <span class="material-icons text-base">delete</span>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          @if (totalItems() > 0) {
            <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-gray-800/30 gap-4">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Mostrando <span class="font-medium">{{ startItem() }}</span> a <span class="font-medium">{{ endItem() }}</span> de <span class="font-medium">{{ totalItems() }}</span> resultados
              </div>
              
              <div class="flex items-center space-x-1">
                <!-- First Page -->
                <button 
                  (click)="goToPage(1)" 
                  [disabled]="currentPage() === 1"
                  class="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Primera Página">
                  <span class="material-icons text-sm">first_page</span>
                </button>
                
                <!-- Previous -->
                <button 
                  (click)="prevPage()" 
                  [disabled]="currentPage() === 1"
                  class="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Anterior">
                  <span class="material-icons text-sm">chevron_left</span>
                </button>

                <!-- Page Numbers -->
                @for (page of visiblePages(); track $index) {
                  @if (page === '...') {
                    <span class="w-8 h-8 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs select-none">...</span>
                  } @else {
                    <button 
                      (click)="goToPage(page)"
                      class="w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors"
                      [class.bg-admin-primary]="currentPage() === page"
                      [class.text-white]="currentPage() === page"
                      [class.border-admin-primary]="currentPage() === page"
                      [class.bg-white]="currentPage() !== page"
                      [class.dark:bg-gray-700]="currentPage() !== page"
                      [class.text-gray-600]="currentPage() !== page"
                      [class.dark:text-gray-300]="currentPage() !== page"
                      [class.border]="currentPage() !== page"
                      [class.border-gray-300]="currentPage() !== page"
                      [class.dark:border-gray-600]="currentPage() !== page"
                      [class.hover:bg-gray-50]="currentPage() !== page"
                      [class.dark:hover:bg-gray-600]="currentPage() !== page">
                      {{ page }}
                    </button>
                  }
                }

                <!-- Next -->
                <button 
                  (click)="nextPage()" 
                  [disabled]="currentPage() === totalPages()"
                  class="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Siguiente">
                  <span class="material-icons text-sm">chevron_right</span>
                </button>
                
                <!-- Last Page -->
                <button 
                  (click)="goToPage(totalPages())" 
                  [disabled]="currentPage() === totalPages()"
                  class="w-8 h-8 flex items-center justify-center rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Última Página">
                  <span class="material-icons text-sm">last_page</span>
                </button>
              </div>
            </div>
          }
        </section>
      </main>

      <footer class="bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <div class="mb-4 md:mb-0">
              <p>© 2024 UIFCE - Facultad de Ciencias Económicas. Universidad Nacional de Colombia.</p>
            </div>
            <div class="flex space-x-4">
              <a class="hover:text-admin-primary dark:hover:text-purple-400" href="#">Términos y condiciones</a>
              <a class="hover:text-admin-primary dark:hover:text-purple-400" href="#">Política de Privacidad</a>
              <a class="hover:text-admin-primary dark:hover:text-purple-400" href="#">Soporte</a>
            </div>
          </div>
        </div>
      </footer>

      <!-- Create/Edit Badge Modal -->
      @if (showCreateModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div (click)="closeModal()" class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"></div>
          
          <!-- Modal Content -->
          <div class="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div class="flex items-center gap-4">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">
                  {{ isEditing() ? 'Editar Insignia' : 'Nueva Insignia' }}
                </h3>
                @if (isEditing()) {
                  <div class="flex items-center gap-2 animate-fade-in">
                    <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 shadow-inner">
                        <button 
                            (click)="loadPreviousBadge()" 
                            [disabled]="!hasPreviousBadge()"
                            class="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-gray-600 dark:text-gray-300"
                            title="Anterior (Insignia)">
                            <span class="material-icons text-lg block">chevron_left</span>
                        </button>
                        <div class="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-0.5"></div>
                        <button 
                            (click)="loadNextBadge()" 
                            [disabled]="!hasNextBadge()"
                            class="p-1.5 rounded-md hover:bg-white dark:hover:bg-gray-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-gray-600 dark:text-gray-300"
                            title="Siguiente (Insignia)">
                            <span class="material-icons text-lg block">chevron_right</span>
                        </button>
                    </div>
                    <span class="text-xs text-gray-400 font-mono hidden sm:inline-block">
                        {{ currentBadgeIndex() + 1 }} / {{ filteredBadges().length }}
                    </span>
                  </div>
                }
              </div>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <span class="material-icons">close</span>
              </button>
            </div>
            
            <div class="p-6 overflow-y-auto custom-scrollbar">
              <div class="space-y-6">
                <!-- Preview Section -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Vista Previa</label>
                    <span class="text-xs text-gray-400">Previsualización en vivo</span>
                  </div>
                  
                  <div class="bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-700 rounded-xl p-6 flex flex-col gap-6">
                    
                    <!-- Centered Large Icon -->
                    <div class="flex flex-col items-center justify-center">
                       <div class="relative group">
                          <div class="w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ring-4 ring-white dark:ring-gray-800 overflow-hidden" 
                              [class]="selectedPalette().iconBg + ' ' + selectedPalette().iconColor">
                            
                            @if (newBadgeImage()) {
                                <img [src]="newBadgeImage()" class="w-full h-full object-cover" alt="Vista previa" />
                                <button (click)="newBadgeImage.set(null)" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                    <span class="material-icons">close</span>
                                </button>
                            } @else {
                                <span class="material-icons text-5xl">{{ newBadgeIcon() || 'stars' }}</span>
                            }
                          </div>
                       </div>
                       <p class="mt-2 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                           {{ newBadgeImage() ? 'Imagen Personalizada' : 'Icono Principal' }}
                       </p>
                    </div>

                    <!-- List Item Preview -->
                    <div>
                      <p class="text-xs text-gray-400 dark:text-gray-500 mb-2 ml-1">Vista en Listado</p>
                      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center shadow-sm">
                        <div class="h-10 w-10 rounded-full flex items-center justify-center mr-3 transition-colors shrink-0 overflow-hidden relative" 
                             [class]="selectedPalette().iconBg + ' ' + selectedPalette().iconColor">
                             @if (newBadgeImage()) {
                                <img [src]="newBadgeImage()" class="w-full h-full object-cover" />
                             } @else {
                                <span class="material-icons">{{ newBadgeIcon() || 'stars' }}</span>
                             }
                        </div>
                        <div class="flex-grow min-w-0">
                          <div class="font-bold text-sm text-gray-900 dark:text-white truncate">{{ newBadgeName() || 'Nombre de la Insignia' }}</div>
                          <div class="text-xs text-gray-500">{{ newBadgeLevel() }}</div>
                        </div>
                        <div class="shrink-0 ml-2">
                          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                            UIFCE
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Basic Info -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la Insignia</label>
                    <input 
                      [(ngModel)]="newBadgeName"
                      type="text" 
                      class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-admin-primary dark:text-white transition-shadow" 
                      placeholder="Ej. Curso Avanzado de R"/>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Curso Asociado</label>
                    <input 
                      [(ngModel)]="newBadgeCourse"
                      type="text" 
                      class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-admin-primary dark:text-white transition-shadow" 
                      placeholder="Ej. Programación Estadística I"/>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nivel</label>
                      <select 
                        [(ngModel)]="newBadgeLevel"
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-admin-primary dark:text-white transition-shadow appearance-none">
                        <option>Nivel Básico</option>
                        <option>Nivel Intermedio</option>
                        <option>Nivel Avanzado</option>
                        <option>Workshop</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icono (Si no hay imagen)</label>
                      <input 
                        [(ngModel)]="newBadgeIcon"
                        type="text" 
                        class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-admin-primary dark:text-white transition-shadow" 
                        placeholder="Ej. school"/>
                    </div>
                  </div>

                  <!-- Image Upload -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Imagen Promocional / Certificado</label>
                    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative group">
                        
                        @if (newBadgeImage()) {
                            <div class="relative w-full text-center">
                                <img [src]="newBadgeImage()" class="max-h-32 mx-auto rounded shadow-sm" alt="Preview">
                                <button (click)="newBadgeImage.set(null)" class="mt-2 text-xs text-red-500 hover:text-red-700 font-medium flex items-center justify-center gap-1">
                                    <span class="material-icons text-sm">delete</span> Eliminar imagen
                                </button>
                            </div>
                        } @else {
                            <div class="space-y-1 text-center">
                                <span class="material-icons text-gray-400 text-3xl">add_photo_alternate</span>
                                <div class="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                                    <label for="file-upload" class="relative cursor-pointer rounded-md font-medium text-admin-primary hover:text-purple-500 focus-within:outline-none">
                                        <span>Subir un archivo</span>
                                        <input id="file-upload" name="file-upload" type="file" class="sr-only" accept="image/*" (change)="onFileSelected($event)">
                                    </label>
                                    <p class="pl-1">o arrastrar y soltar</p>
                                </div>
                                <p class="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                            </div>
                        }
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                    <textarea 
                      [(ngModel)]="newBadgeDescription"
                      rows="3"
                      class="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-admin-primary dark:text-white transition-shadow resize-none" 
                      placeholder="Describe los requisitos y competencias de esta insignia..."></textarea>
                  </div>
                </div>

                <!-- Palette Selector -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Estilo Visual (Paleta de Colores)</label>
                  <div class="grid grid-cols-4 gap-3">
                    @for (palette of palettes; track palette.id) {
                      <button 
                        (click)="selectPalette(palette)"
                        class="relative flex flex-col items-center p-2 rounded-lg border-2 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
                        [class]="selectedPalette().id === palette.id ? 'border-admin-primary bg-purple-50 dark:bg-purple-900/20' : 'border-transparent'">
                        
                        <div class="w-10 h-10 rounded-full flex items-center justify-center mb-1 shadow-sm"
                             [class]="palette.iconBg + ' ' + palette.iconColor">
                          <span class="material-icons text-lg">circle</span>
                        </div>
                        <span class="text-[10px] font-medium text-gray-600 dark:text-gray-400 text-center leading-tight">{{ palette.name }}</span>
                        
                        @if (selectedPalette().id === palette.id) {
                          <div class="absolute top-1 right-1 w-4 h-4 bg-admin-primary text-white rounded-full flex items-center justify-center shadow-sm">
                            <span class="material-icons text-[10px] font-bold">check</span>
                          </div>
                        }
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 rounded-b-xl">
              <button 
                (click)="closeModal()"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                Cancelar
              </button>
              <button 
                (click)="saveBadge()"
                class="px-4 py-2 text-sm font-medium text-white bg-admin-primary hover:bg-purple-800 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                <span class="material-icons text-sm">save</span>
                <span>{{ isEditing() ? 'Guardar Cambios' : 'Guardar Insignia' }}</span>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminCatalogComponent {
  searchQuery = signal('');
  selectedUnit = signal('');
  selectedStatus = signal('Todos');
  selectedLevel = signal('');
  
  // Sorting
  sortColumn = signal<string>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  itemsPerPage = signal(5);
  currentPage = signal(1);
  
  // Modal State
  showCreateModal = signal(false);
  isEditing = signal(false);
  currentBadgeId = signal<number | null>(null);

  newBadgeName = signal('');
  newBadgeLevel = signal('Nivel Básico');
  newBadgeCourse = signal('');
  newBadgeIcon = signal('stars');
  newBadgeDescription = signal('');
  newBadgeImage = signal<string | null>(null);

  palettes = PALETTES;
  selectedPalette = signal(PALETTES[0]);

  // Raw data expanded to demonstrate pagination with filtering
  badges = signal<any[]>([
    {
      id: 1,
      name: 'Analista de Datos Jr',
      level: 'Nivel Básico',
      uuid: 'BD-2024-001-A',
      course: 'Introducción a Power BI y SQL',
      unit: 'UIFCE',
      hours: '40h',
      status: 'Activo',
      icon: 'analytics',
      description: 'Certifica las competencias básicas en análisis de datos, uso de herramientas como Power BI y consultas SQL fundamentales.',
      image: null,
      iconBgClass: 'bg-indigo-100 dark:bg-indigo-900',
      iconColorClass: 'text-indigo-600 dark:text-indigo-300',
      unitBgClass: 'bg-purple-100 dark:bg-purple-900/40',
      unitColorClass: 'text-purple-800 dark:text-purple-300'
    },
    {
      id: 2,
      name: 'Python para Finanzas',
      level: 'Nivel Intermedio',
      uuid: 'PY-2024-055-B',
      course: 'Automatización financiera con Python',
      unit: 'Posgrados',
      hours: '60h',
      status: 'Activo',
      icon: 'code',
      description: '',
      image: null,
      iconBgClass: 'bg-purple-100 dark:bg-purple-900',
      iconColorClass: 'text-purple-600 dark:text-purple-300',
      unitBgClass: 'bg-blue-100 dark:bg-blue-900/40',
      unitColorClass: 'text-blue-800 dark:text-blue-300'
    },
    {
      id: 3,
      name: 'Experto en Excel',
      level: 'Nivel Avanzado',
      uuid: 'EX-2023-112-C',
      course: 'Excel Avanzado para Negocios',
      unit: 'Edu. Continua',
      hours: '32h',
      status: 'Inactivo',
      icon: 'pie_chart',
      description: '',
      image: null,
      iconBgClass: 'bg-orange-100 dark:bg-orange-900',
      iconColorClass: 'text-orange-600 dark:text-orange-300',
      unitBgClass: 'bg-orange-100 dark:bg-orange-900/40',
      unitColorClass: 'text-orange-800 dark:text-orange-300'
    },
    {
      id: 4,
      name: 'Fundamentos SQL',
      level: 'Nivel Básico',
      uuid: 'DB-2024-089-A',
      course: 'Bases de datos para no ingenieros',
      unit: 'UIFCE',
      hours: '24h',
      status: 'Activo',
      icon: 'storage',
      description: '',
      image: null,
      iconBgClass: 'bg-teal-100 dark:bg-teal-900',
      iconColorClass: 'text-teal-600 dark:text-teal-300',
      unitBgClass: 'bg-purple-100 dark:bg-purple-900/40',
      unitColorClass: 'text-purple-800 dark:text-purple-300'
    },
    {
      id: 5,
      name: 'Economía Digital',
      level: 'Workshop',
      uuid: 'EC-2024-010-W',
      course: 'Seminario de Economía Digital Global',
      unit: 'Decanatura',
      hours: '12h',
      status: 'Pendiente',
      icon: 'public',
      description: '',
      image: null,
      iconBgClass: 'bg-indigo-100 dark:bg-indigo-900',
      iconColorClass: 'text-indigo-600 dark:text-indigo-300',
      unitBgClass: 'bg-teal-100 dark:bg-teal-900/40',
      unitColorClass: 'text-teal-800 dark:text-teal-300'
    },
    {
      id: 6,
      name: 'Visualización de Datos con Tableau',
      level: 'Nivel Intermedio',
      uuid: 'TB-2024-012-B',
      course: 'Tableau for Data Science',
      unit: 'UIFCE',
      hours: '40h',
      status: 'Activo',
      icon: 'analytics',
      description: '',
      image: null,
      iconBgClass: 'bg-indigo-100 dark:bg-indigo-900',
      iconColorClass: 'text-indigo-600 dark:text-indigo-300',
      unitBgClass: 'bg-purple-100 dark:bg-purple-900/40',
      unitColorClass: 'text-purple-800 dark:text-purple-300'
    },
    {
      id: 7,
      name: 'Machine Learning Básico',
      level: 'Nivel Avanzado',
      uuid: 'ML-2024-001-A',
      course: 'Introducción al Machine Learning',
      unit: 'Posgrados',
      hours: '50h',
      status: 'Activo',
      icon: 'psychology',
      description: '',
      image: null,
      iconBgClass: 'bg-purple-100 dark:bg-purple-900',
      iconColorClass: 'text-purple-600 dark:text-purple-300',
      unitBgClass: 'bg-blue-100 dark:bg-blue-900/40',
      unitColorClass: 'text-blue-800 dark:text-blue-300'
    },
    {
      id: 8,
      name: 'Gestión de Proyectos Ágiles',
      level: 'Nivel Básico',
      uuid: 'PM-2024-003-C',
      course: 'Fundamentos de Scrum y Kanban',
      unit: 'Edu. Continua',
      hours: '20h',
      status: 'Activo',
      icon: 'group_work',
      description: '',
      image: null,
      iconBgClass: 'bg-orange-100 dark:bg-orange-900',
      iconColorClass: 'text-orange-600 dark:text-orange-300',
      unitBgClass: 'bg-orange-100 dark:bg-orange-900/40',
      unitColorClass: 'text-orange-800 dark:text-orange-300'
    },
    {
      id: 9,
      name: 'Marketing Digital 360',
      level: 'Workshop',
      uuid: 'MK-2024-009-W',
      course: 'Estrategias de Marketing Moderno',
      unit: 'Decanatura',
      hours: '16h',
      status: 'Inactivo',
      icon: 'campaign',
      description: '',
      image: null,
      iconBgClass: 'bg-indigo-100 dark:bg-indigo-900',
      iconColorClass: 'text-indigo-600 dark:text-indigo-300',
      unitBgClass: 'bg-teal-100 dark:bg-teal-900/40',
      unitColorClass: 'text-teal-800 dark:text-teal-300'
    },
    {
      id: 10,
      name: 'R para Estadística',
      level: 'Nivel Avanzado',
      uuid: 'RS-2024-022-A',
      course: 'Estadística Avanzada con R',
      unit: 'UIFCE',
      hours: '45h',
      status: 'Pendiente',
      icon: 'functions',
      description: '',
      image: null,
      iconBgClass: 'bg-teal-100 dark:bg-teal-900',
      iconColorClass: 'text-teal-600 dark:text-teal-300',
      unitBgClass: 'bg-purple-100 dark:bg-purple-900/40',
      unitColorClass: 'text-purple-800 dark:text-purple-300'
    },
    {
      id: 11,
      name: 'Liderazgo Empresarial',
      level: 'Nivel Intermedio',
      uuid: 'LE-2024-044-B',
      course: 'Liderazgo y Gestión de Equipos',
      unit: 'Posgrados',
      hours: '30h',
      status: 'Activo',
      icon: 'stars',
      description: '',
      image: null,
      iconBgClass: 'bg-purple-100 dark:bg-purple-900',
      iconColorClass: 'text-purple-600 dark:text-purple-300',
      unitBgClass: 'bg-blue-100 dark:bg-blue-900/40',
      unitColorClass: 'text-blue-800 dark:text-blue-300'
    },
     {
      id: 12,
      name: 'Finanzas Personales',
      level: 'Nivel Básico',
      uuid: 'FP-2024-088-A',
      course: 'Educación Financiera Básica',
      unit: 'Bienestar',
      hours: '12h',
      status: 'Activo',
      icon: 'attach_money',
      description: '',
      image: null,
      iconBgClass: 'bg-green-100 dark:bg-green-900',
      iconColorClass: 'text-green-600 dark:text-green-300',
      unitBgClass: 'bg-green-100 dark:bg-green-900/40',
      unitColorClass: 'text-green-800 dark:text-green-300'
    }
  ]);

  // Extract unique units for the dropdown
  units = computed(() => {
    const uniqueUnits = new Set(this.badges().map(b => b.unit));
    return Array.from(uniqueUnits).sort();
  });

  // Extract unique levels for the dropdown
  levels = computed(() => {
    const uniqueLevels = new Set(this.badges().map(b => b.level));
    return Array.from(uniqueLevels).sort();
  });

  filteredBadges = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const unit = this.selectedUnit();
    const status = this.selectedStatus();
    const level = this.selectedLevel();
    
    // 1. Filtering
    let result = this.badges().filter(b => {
      const matchesSearch = !query || 
        b.name.toLowerCase().includes(query) || 
        b.uuid.toLowerCase().includes(query) ||
        b.course.toLowerCase().includes(query) ||
        b.unit.toLowerCase().includes(query);
        
      const matchesUnit = !unit || b.unit === unit;
      const matchesLevel = !level || b.level === level;
      const matchesStatus = status === 'Todos' || b.status === status;

      return matchesSearch && matchesUnit && matchesStatus && matchesLevel;
    });

    // 2. Sorting
    const col = this.sortColumn();
    const dir = this.sortDirection();
    const multiplier = dir === 'asc' ? 1 : -1;

    result = [...result].sort((a, b) => {
        let valA = a[col];
        let valB = b[col];

        // Handle numeric parsing for hours (e.g., "40h")
        if (col === 'hours') {
            valA = parseInt(valA) || 0;
            valB = parseInt(valB) || 0;
        } else if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }

        if (valA < valB) return -1 * multiplier;
        if (valA > valB) return 1 * multiplier;
        return 0;
    });

    return result;
  });

  totalItems = computed(() => this.filteredBadges().length);
  
  startItem = computed(() => {
    if (this.totalItems() === 0) return 0;
    return ((this.currentPage() - 1) * this.itemsPerPage()) + 1;
  });
  
  endItem = computed(() => Math.min(this.currentPage() * this.itemsPerPage(), this.totalItems()));
  
  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }

    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, '...', current - 1, current, current + 1, '...', total];
  });

  paginatedBadges = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return this.filteredBadges().slice(startIndex, endIndex);
  });

  currentBadgeIndex = computed(() => {
    const id = this.currentBadgeId();
    if (id === null) return -1;
    return this.filteredBadges().findIndex(b => b.id === id);
  });

  hasPreviousBadge = computed(() => this.currentBadgeIndex() > 0);
  hasNextBadge = computed(() => this.currentBadgeIndex() !== -1 && this.currentBadgeIndex() < this.filteredBadges().length - 1);

  toggleSort(column: string) {
    if (this.sortColumn() === column) {
        this.sortDirection.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
        this.sortColumn.set(column);
        this.sortDirection.set('asc');
    }
  }

  updateSearch(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.currentPage.set(1); // Reset to page 1 on search
  }

  updateUnit(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this.selectedUnit.set(value);
    this.currentPage.set(1); // Reset to page 1 on filter change
  }
  
  setStatus(status: string) {
      this.selectedStatus.set(status);
      this.currentPage.set(1);
  }

  updateLevel(e: Event) {
      const value = (e.target as HTMLSelectElement).value;
      this.selectedLevel.set(value);
      this.currentPage.set(1);
  }

  goToPage(page: number | string | unknown) {
    if (typeof page === 'number') {
      this.currentPage.set(page);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
  
  openModal(badge?: any) {
    if (badge) {
      this.isEditing.set(true);
      this.currentBadgeId.set(badge.id);
      this.newBadgeName.set(badge.name);
      this.newBadgeLevel.set(badge.level);
      this.newBadgeCourse.set(badge.course);
      this.newBadgeIcon.set(badge.icon);
      this.newBadgeDescription.set(badge.description || '');
      this.newBadgeImage.set(badge.image || null);
      
      const palette = this.palettes.find(p => p.iconBg === badge.iconBgClass) || this.palettes[0];
      this.selectedPalette.set(palette);
    } else {
      this.isEditing.set(false);
      this.currentBadgeId.set(null);
      this.resetForm();
    }
    this.showCreateModal.set(true);
  }

  closeModal() {
    this.showCreateModal.set(false);
  }

  resetForm() {
    this.newBadgeName.set('');
    this.newBadgeIcon.set('stars');
    this.newBadgeLevel.set('Nivel Básico');
    this.newBadgeCourse.set('');
    this.newBadgeDescription.set('');
    this.newBadgeImage.set(null);
    this.selectedPalette.set(this.palettes[0]);
  }

  selectPalette(palette: any) {
    this.selectedPalette.set(palette);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.newBadgeImage.set(result);
      };
      reader.readAsDataURL(file);
    }
  }

  loadPreviousBadge() {
    const idx = this.currentBadgeIndex();
    if (idx > 0) {
      this.openModal(this.filteredBadges()[idx - 1]);
    }
  }

  loadNextBadge() {
    const idx = this.currentBadgeIndex();
    if (idx < this.filteredBadges().length - 1) {
      this.openModal(this.filteredBadges()[idx + 1]);
    }
  }

  saveBadge() {
    if (this.isEditing() && this.currentBadgeId()) {
      this.badges.update(items => items.map(item => {
        if (item.id === this.currentBadgeId()) {
           return {
             ...item,
             name: this.newBadgeName(),
             level: this.newBadgeLevel(),
             course: this.newBadgeCourse(),
             icon: this.newBadgeIcon(),
             description: this.newBadgeDescription(),
             image: this.newBadgeImage(),
             iconBgClass: this.selectedPalette().iconBg,
             iconColorClass: this.selectedPalette().iconColor
           };
        }
        return item;
      }));
    } else {
      const newBadge = {
        id: Date.now(),
        name: this.newBadgeName() || 'Nueva Insignia',
        level: this.newBadgeLevel(),
        uuid: `NEW-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        course: this.newBadgeCourse() || 'Curso General',
        unit: this.selectedUnit() || 'UIFCE', 
        hours: '20h', 
        status: 'Activo',
        icon: this.newBadgeIcon(),
        description: this.newBadgeDescription(),
        image: this.newBadgeImage(),
        iconBgClass: this.selectedPalette().iconBg,
        iconColorClass: this.selectedPalette().iconColor,
        unitBgClass: 'bg-purple-100 dark:bg-purple-900/40',
        unitColorClass: 'text-purple-800 dark:text-purple-300'
      };
      
      this.badges.update(badges => [newBadge, ...badges]);
    }
    this.closeModal();
    this.resetForm();
  }
}
