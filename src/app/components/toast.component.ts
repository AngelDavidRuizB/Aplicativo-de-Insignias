import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          @toastAnimation
          class="pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md animate-slide-up"
          [class.bg-green-500]='toast.type === "success"'
          [class.bg-red-500]='toast.type === "error"'
          [class.bg-amber-500]='toast.type === "warning"'
          [class.bg-blue-500]='toast.type === "info"'
          [class.text-white]='true'>
          <span class="material-icons">
            {{ getIcon(toast.type) }}
          </span>
          <span class="flex-1 text-sm font-medium">{{ toast.message }}</span>
          <button 
            (click)="toastService.remove(toast.id)"
            class="opacity-70 hover:opacity-100 transition-opacity">
            <span class="material-icons text-sm">close</span>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-slide-up {
      animation: slide-up 0.3s ease-out;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  }
}
