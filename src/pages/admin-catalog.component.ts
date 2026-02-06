
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="font-display text-gray-800 dark:text-gray-100 min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <!-- Admin Header -->
      <header class="bg-admin-primary text-white shadow-md">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
          <div class="flex items-center space-x-3 cursor-pointer" routerLink="/">
            <div class="font-bold text-2xl flex items-center">
              <span class="text-3xl font-black mr-1">FCE</span>
              <div class="border-l border-white/40 pl-2 text-xs leading-tight">
                Facultad de<br/>Ciencias Económicas
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <div class="text-right">
              <h1 class="text-2xl font-bold tracking-tight">UIFCE</h1>
              <p class="text-[0.6rem] uppercase tracking-wider text-right text-white/80">Unidad de Informática</p>
            </div>
          </div>
        </div>
        <nav class="bg-admin-secondary text-white text-sm">
          <div class="container mx-auto px-4">
            <div class="flex items-center justify-end overflow-x-auto py-2">
              <div class="flex items-center space-x-4">
                <div class="flex items-center text-xs">
                  <span class="material-icons text-sm mr-1">person</span>
                  <span class="font-medium mr-2">Ángel David</span>
                  <span class="bg-purple-900/40 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Administrador</span>
                </div>
                <button class="hover:bg-purple-800 p-1 rounded-full transition-colors" routerLink="/">
                  <span class="material-icons text-sm">logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

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
            <button class="flex items-center space-x-2 bg-admin-primary text-white border-2 border-admin-primary px-4 py-2 rounded-lg font-semibold hover:bg-purple-900 transition-colors shadow-md">
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

          <div class="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <div class="flex flex-wrap gap-2 w-full md:w-auto items-center">
              <div class="flex flex-wrap gap-2">
                <button class="px-3 py-1.5 text-xs font-medium rounded-md bg-admin-primary text-white shadow-sm">Todos</button>
                <button class="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Activos</button>
                <button class="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Inactivos</button>
                <button class="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">Archivados</button>
              </div>
              
              <div class="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

              <div class="relative min-w-[180px]">
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
            </div>

            <div class="relative w-full md:w-80">
              <input 
                [value]="searchQuery()"
                (input)="updateSearch($event)"
                class="w-full pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-admin-primary focus:border-transparent dark:text-white placeholder-gray-400 outline-none transition-shadow" 
                placeholder="Buscar por nombre, código o ID..." 
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
                  <th class="px-6 py-4">Insignia</th>
                  <th class="px-6 py-4">UUID / ID Referencia</th>
                  <th class="px-6 py-4">Curso Asociado</th>
                  <th class="px-6 py-4">Unidad Emisora</th>
                  <th class="px-6 py-4 text-center">Horas</th>
                  <th class="px-6 py-4 text-center">Estado</th>
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
                        <div class="h-10 w-10 rounded-full flex items-center justify-center" [class]="badge.iconBgClass + ' ' + badge.iconColorClass">
                          <span class="material-icons">{{badge.icon}}</span>
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
                      <button class="text-gray-400 hover:text-admin-primary dark:hover:text-purple-400 transition-colors p-1">
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
    </div>
  `
})
export class AdminCatalogComponent {
  searchQuery = signal('');
  selectedUnit = signal('');
  itemsPerPage = signal(5);
  currentPage = signal(1);

  // Raw data expanded to demonstrate pagination with filtering
  badges = signal([
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
      iconBgClass: 'bg-indigo-100 dark:bg-indigo-900',
      iconColorClass: 'text-indigo-600 dark:text-indigo-300',
      unitBgClass: 'bg-teal-100 dark:bg-teal-900/40',
      unitColorClass: 'text-teal-800 dark:text-teal-300'
    },
    // Duplicate data to demonstrate pagination
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

  filteredBadges = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const unit = this.selectedUnit();
    
    return this.badges().filter(b => {
      const matchesSearch = !query || 
        b.name.toLowerCase().includes(query) || 
        b.uuid.toLowerCase().includes(query);
        
      const matchesUnit = !unit || b.unit === unit;

      return matchesSearch && matchesUnit;
    });
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
}
