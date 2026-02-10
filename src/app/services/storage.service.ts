import { Injectable, signal, effect } from '@angular/core';
import { Badge, IssuedBadge, Student, PALETTES, UNITS, ICONS } from '../models/badge.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly BADGES_KEY = 'fce_badges';
  private readonly ISSUED_KEY = 'fce_issued';
  private readonly STUDENTS_KEY = 'fce_students';
  private readonly CURRENT_USER_KEY = 'fce_user';

  // Signals públicos
  badges = signal<Badge[]>([]);
  issuedBadges = signal<IssuedBadge[]>([]);
  students = signal<Student[]>([]);
  currentUser = signal<{name: string, role: 'admin' | 'student'} | null>(null);

  constructor() {
    this.loadFromStorage();
    this.setupAutoSave();
  }

  private loadFromStorage(): void {
    try {
      // Cargar insignias
      const badgesData = localStorage.getItem(this.BADGES_KEY);
      if (badgesData) {
        const parsed = JSON.parse(badgesData);
        this.badges.set(parsed.map((b: any) => ({
          ...b,
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt)
        })));
      } else {
        this.initializeDefaultBadges();
      }

      // Cargar insignias emitidas
      const issuedData = localStorage.getItem(this.ISSUED_KEY);
      if (issuedData) {
        const parsed = JSON.parse(issuedData);
        this.issuedBadges.set(parsed.map((i: any) => ({
          ...i,
          issueDate: new Date(i.issueDate)
        })));
      }

      // Cargar estudiantes
      const studentsData = localStorage.getItem(this.STUDENTS_KEY);
      if (studentsData) {
        const parsed = JSON.parse(studentsData);
        this.students.set(parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt)
        })));
      }

      // Cargar usuario actual
      const user = localStorage.getItem(this.CURRENT_USER_KEY);
      if (user) {
        this.currentUser.set(JSON.parse(user));
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
      this.initializeDefaultBadges();
    }
  }

  private setupAutoSave(): void {
    // Guardar automáticamente cuando cambien los signals
    effect(() => {
      localStorage.setItem(this.BADGES_KEY, JSON.stringify(this.badges()));
    });

    effect(() => {
      localStorage.setItem(this.ISSUED_KEY, JSON.stringify(this.issuedBadges()));
    });

    effect(() => {
      localStorage.setItem(this.STUDENTS_KEY, JSON.stringify(this.students()));
    });

    effect(() => {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.CURRENT_USER_KEY);
      }
    });
  }

  setUser(name: string, role: 'admin' | 'student'): void {
    this.currentUser.set({ name, role });
  }

  clearUser(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  private initializeDefaultBadges(): void {
    const defaultBadges: Badge[] = [
      {
        id: this.generateId(),
        name: 'Introducción a Power BI y SQL',
        unit: 'UIFCE',
        hours: 40,
        status: 'Activo',
        description: 'Certifica competencias básicas en análisis de datos, uso de Power BI y consultas SQL fundamentales.',
        icon: 'analytics',
        colorTheme: 'data',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateId(),
        name: 'Automatización financiera con Python',
        unit: 'Posgrados',
        hours: 60,
        status: 'Activo',
        description: 'Desarrollo de scripts y análisis financiero usando Python.',
        icon: 'code',
        colorTheme: 'tech',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateId(),
        name: 'Excel Avanzado para Negocios',
        unit: 'Educación Continua',
        hours: 32,
        status: 'Activo',
        description: 'Dominio avanzado de Excel: macros, VBA, tablas dinámicas.',
        icon: 'bar_chart',
        colorTheme: 'expert',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateId(),
        name: 'Bases de datos para no ingenieros',
        unit: 'UIFCE',
        hours: 24,
        status: 'Activo',
        description: 'Introducción a bases de datos relacionales y SQL.',
        icon: 'storage',
        colorTheme: 'data',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateId(),
        name: 'Fundamentos de Scrum y Kanban',
        unit: 'Educación Continua',
        hours: 20,
        status: 'Activo',
        description: 'Metodologías ágiles para gestión de proyectos.',
        icon: 'group_work',
        colorTheme: 'management',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.generateId(),
        name: 'Introducción al Machine Learning',
        unit: 'Posgrados',
        hours: 50,
        status: 'Activo',
        description: 'Conceptos fundamentales de ML y algoritmos básicos.',
        icon: 'psychology',
        colorTheme: 'tech',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.badges.set(defaultBadges);
  }

  // Métodos CRUD para Badges
  addBadge(badge: Omit<Badge, 'id' | 'createdAt' | 'updatedAt'>): Badge {
    const newBadge: Badge = {
      ...badge,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.badges.update(badges => [...badges, newBadge]);
    return newBadge;
  }

  updateBadge(id: string, updates: Partial<Badge>): boolean {
    let found = false;
    this.badges.update(badges => {
      return badges.map(b => {
        if (b.id === id) {
          found = true;
          return { ...b, ...updates, updatedAt: new Date() };
        }
        return b;
      });
    });
    return found;
  }

  deleteBadge(id: string): boolean {
    const initialLength = this.badges().length;
    this.badges.update(badges => badges.filter(b => b.id !== id));
    return this.badges().length < initialLength;
  }

  getBadgeById(id: string): Badge | undefined {
    return this.badges().find(b => b.id === id);
  }

  // Métodos para insignias emitidas
  issueBadge(data: Omit<IssuedBadge, 'id' | 'hash' | 'issueDate'>): IssuedBadge {
    const hash = this.generateHash();
    const newIssued: IssuedBadge = {
      ...data,
      id: this.generateId(),
      hash,
      issueDate: new Date()
    };
    this.issuedBadges.update(issued => [...issued, newIssued]);
    return newIssued;
  }

  validateBadge(hash: string): IssuedBadge | undefined {
    return this.issuedBadges().find(i => i.hash === hash && i.status === 'Válido');
  }

  revokeBadge(id: string): boolean {
    let found = false;
    this.issuedBadges.update(issued => {
      return issued.map(i => {
        if (i.id === id) {
          found = true;
          return { ...i, status: 'Revocado' as const };
        }
        return i;
      });
    });
    return found;
  }

  // Métodos para estudiantes
  addStudent(student: Omit<Student, 'id' | 'createdAt'>): Student {
    const newStudent: Student = {
      ...student,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.students.update(students => [...students, newStudent]);
    return newStudent;
  }

  getStudentByDocument(documentNumber: string): Student | undefined {
    return this.students().find(s => s.documentNumber === documentNumber);
  }

  // Métodos de utilidad
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateHash(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let hash = '';
    for (let i = 0; i < 16; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash.match(/.{4}/g)!.join('-');
  }

  exportData(): string {
    return JSON.stringify({
      badges: this.badges(),
      issued: this.issuedBadges(),
      students: this.students(),
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.badges) {
        this.badges.set(data.badges.map((b: any) => ({
          ...b,
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt)
        })));
      }
      if (data.issued) {
        this.issuedBadges.set(data.issued.map((i: any) => ({
          ...i,
          issueDate: new Date(i.issueDate)
        })));
      }
      if (data.students) {
        this.students.set(data.students.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt)
        })));
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  clearAllData(): void {
    this.badges.set([]);
    this.issuedBadges.set([]);
    this.students.set([]);
    localStorage.removeItem(this.BADGES_KEY);
    localStorage.removeItem(this.ISSUED_KEY);
    localStorage.removeItem(this.STUDENTS_KEY);
  }

  // Getters para listas constantes
  getPalettes() { return PALETTES; }
  getUnits() { return UNITS; }
  getIcons() { return ICONS; }
}
