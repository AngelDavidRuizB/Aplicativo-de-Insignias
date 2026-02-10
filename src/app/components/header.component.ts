import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bg-[#4a148c] text-white shadow-lg sticky top-0 z-50">
      <!-- Top section with FCE and UIFCE -->
      <div class="bg-[#4a148c]">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
          <!-- Left: FCE Logo -->
          <div class="flex items-center space-x-3 cursor-pointer" routerLink="/">
            <div class="flex flex-col leading-tight">
              <span class="font-bold text-2xl tracking-tighter font-serif">FCE</span>
              <span class="text-[10px] uppercase tracking-wide opacity-90">Facultad de<br/>Ciencias Económicas</span>
            </div>
          </div>
          
          <!-- Right: UIFCE -->
          <div class="flex items-center space-x-3 text-right">
            <div class="flex flex-col leading-tight">
              <span class="font-bold text-2xl tracking-tighter">UIFCE</span>
              <span class="text-[9px] uppercase tracking-wider opacity-80 border-t border-white/30 pt-0.5 mt-0.5">Unidad Informática de la Facultad de Ciencias Económicas</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bottom section with user info and logout -->
      <div class="bg-[#3a106c] border-t border-white/10">
        <div class="container mx-auto px-4 py-2.5">
          <div class="flex items-center justify-end gap-4">
            <!-- User info with role badge -->
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2 bg-black/20 px-4 py-1.5 rounded-full">
                <span class="material-icons text-lg">person</span>
                <span class="font-medium text-sm">{{ userName() }}</span>
                
                <!-- Role badge -->
                <span 
                  class="text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider ml-2"
                  [class.bg-admin-secondary]="userRole() === 'Estudiante'"
                  [class.bg-purple-800]="userRole() === 'Administrativo'"
                  [class.text-white]="true">
                  {{ userRole() }}
                </span>
              </div>
              
              <!-- Role selector toggle (only for initial panel) -->
              @if (showRoleSelector()) {
                <div class="flex items-center space-x-1 bg-white/10 rounded-lg p-1">
                  <button 
                    (click)="onRoleChange('Estudiante')"
                    class="px-3 py-1 text-xs font-medium rounded transition-colors"
                    [class.bg-white]="userRole() === 'Estudiante'"
                    [class.text-admin-primary]="userRole() === 'Estudiante'"
                    [class.text-white]="userRole() !== 'Estudiante'"
                    [class.hover:bg-white/20]="userRole() !== 'Estudiante'">
                    Estudiante
                  </button>
                  <button 
                    (click)="onRoleChange('Administrativo')"
                    class="px-3 py-1 text-xs font-medium rounded transition-colors"
                    [class.bg-white]="userRole() === 'Administrativo'"
                    [class.text-admin-primary]="userRole() === 'Administrativo'"
                    [class.text-white]="userRole() !== 'Administrativo'"
                    [class.hover:bg-white/20]="userRole() !== 'Administrativo'">
                    Administrativo
                  </button>
                </div>
              }
            </div>
            
            <!-- Logout button -->
            <button 
              (click)="onLogout()"
              class="hover:bg-white/10 p-2 rounded-full transition flex items-center justify-center"
              title="Cerrar sesión">
              <span class="material-icons transform rotate-180">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  // Inputs
  userName = input<string>('Ángel David');
  userRole = input<'Estudiante' | 'Administrativo'>('Estudiante');
  showRoleSelector = input<boolean>(false);
  
  // Outputs
  roleChange = output<'Estudiante' | 'Administrativo'>();
  logout = output<void>();
  
  onRoleChange(role: 'Estudiante' | 'Administrativo') {
    this.roleChange.emit(role);
  }
  
  onLogout() {
    this.logout.emit();
  }
}
