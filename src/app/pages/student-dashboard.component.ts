import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { PdfService } from '../services/pdf.service';
import { IssuedBadge, Badge } from '../models/badge.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-dashboard.component.html'
})
export class StudentDashboardComponent {
  private storageService = inject(StorageService);
  private toastService = inject(ToastService);
  private pdfService = inject(PdfService);
  private router = inject(Router);

  viewMode = signal<'grid' | 'list'>('grid');
  selectedFilter = signal<string>('Todas');
  selectedBadgeDetail = signal<{issued: IssuedBadge | undefined, badge: Badge} | null>(null);

  currentUser = computed(() => this.storageService.currentUser());

  // Define filters available in the mockup
  filters = ['Todas', 'Unidad Informática de la Facultad de Ciencias Económicas', 'Posgrados', 'Bienestar'];

  // All badges with their status for the current user
  allBadgesWithStatus = computed(() => {
    const allBadges = this.storageService.badges();
    const issuedBadges = this.storageService.issuedBadges();
    
    // Create a map of issued badges for quick lookup
    const issuedMap = new Map(issuedBadges.map(i => [i.badgeId, i]));

    return allBadges.map(badge => {
      const issued = issuedMap.get(badge.id);
      let status: 'completed' | 'in_progress' | 'pending' = 'pending';
      
      if (issued && issued.status === 'Válido') {
        status = 'completed';
      } else {
        // Simple logic for demo: randomly assign in_progress to some badges 
        // if they are not completed, just to match the visual mockup variety
        // In a real app, this would come from a "CourseEnrollment" service
        status = Math.random() > 0.8 ? 'in_progress' : 'pending';
      }

      return {
        badge,
        issued, // undefined if not completed
        status,
        progress: status === 'in_progress' ? Math.floor(Math.random() * 80) + 10 : 0
      };
    });
  });

  filteredBadges = computed(() => {
    const badges = this.allBadgesWithStatus();
    const filter = this.selectedFilter();

    if (filter === 'Todas') {
      return badges;
    }
    return badges.filter(item => item.badge.unit === filter);
  });

  completedBadgesCount = computed(() => 
    this.allBadgesWithStatus().filter(b => b.status === 'completed').length
  );
  
  totalHours = computed(() => 
    this.allBadgesWithStatus()
      .filter(b => b.status === 'completed')
      .reduce((sum, item) => sum + item.badge.hours, 0)
  );

  progressPercentage = computed(() => {
    // Mockup says "2/3 Insignias", let's calculate based on total available vs completed? 
    // Or just use the previous logic of credits.
    // Let's stick to the previous credits logic for continuity but adapt it.
    const earned = this.creditsEarned();
    return Math.min((earned / 4) * 100, 100);
  });

  creditsEarned = computed(() => {
    const completed = this.completedBadgesCount();
    return Math.min(completed * 1.5, 6);
  });

  showDetails(item: {issued: IssuedBadge | undefined, badge: Badge}): void {
    this.selectedBadgeDetail.set(item);
  }

  downloadCertificate(item: {issued: IssuedBadge | undefined, badge: Badge}): void {
    if (item.issued) {
      this.pdfService.downloadCertificate(item.issued, item.badge);
      this.toastService.success('Certificado descargado');
    }
  }

  downloadAllCertificates(): void {
    const badges = this.allBadgesWithStatus()
      .filter(item => item.status === 'completed' && item.issued)
      .map(item => ({ issued: item.issued!, badge: item.badge }));

    if (badges.length === 0) {
      this.toastService.warning('No tienes certificados para descargar');
      return;
    }

    badges.forEach((item, index) => {
      setTimeout(() => {
        this.pdfService.downloadCertificate(item.issued, item.badge);
      }, index * 500);
    });
    
    this.toastService.success(`Descargando ${badges.length} certificados...`);
  }

  async shareBadge(item: {issued: IssuedBadge | undefined, badge: Badge}): Promise<void> {
    if (!item.issued) return;
    
    const text = `He obtenido la insignia "${item.badge.name}" de la Universidad Nacional de Colombia!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Insignia FCE',
          text: text,
          url: window.location.origin
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      this.toastService.success('Texto copiado al portapapeles');
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  logout(): void {
    this.router.navigate(['/']);
  }
}
