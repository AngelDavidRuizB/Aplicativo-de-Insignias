export interface Badge {
  id: string;
  name: string;
  unit: string;
  hours: number;
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  description: string;
  icon: string;
  image?: string;
  colorTheme: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  documentNumber: string;
  fullName: string;
  email: string;
  career?: string;
  createdAt: Date;
}

export interface IssuedBadge {
  id: string;
  badgeId: string;
  studentId: string;
  studentName: string;
  studentDocument: string;
  badgeName: string;
  issueDate: Date;
  grade: number;
  hash: string;
  status: 'Válido' | 'Revocado';
  certificateUrl?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  unit: string;
  hours: number;
  instructor: string;
  startDate: Date;
  endDate: Date;
  status: 'Activo' | 'Inactivo';
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

export const PALETTES = [
  { id: 'tech', name: 'Tecnología', bg: 'bg-blue-500', text: 'text-blue-600', lightBg: 'bg-blue-50', border: 'border-blue-200' },
  { id: 'finance', name: 'Finanzas', bg: 'bg-emerald-500', text: 'text-emerald-600', lightBg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'management', name: 'Gestión', bg: 'bg-indigo-500', text: 'text-indigo-600', lightBg: 'bg-indigo-50', border: 'border-indigo-200' },
  { id: 'creative', name: 'Creativo', bg: 'bg-pink-500', text: 'text-pink-600', lightBg: 'bg-pink-50', border: 'border-pink-200' },
  { id: 'expert', name: 'Experto', bg: 'bg-amber-500', text: 'text-amber-600', lightBg: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'data', name: 'Datos', bg: 'bg-cyan-500', text: 'text-cyan-600', lightBg: 'bg-cyan-50', border: 'border-cyan-200' },
  { id: 'basic', name: 'Básico', bg: 'bg-slate-500', text: 'text-slate-600', lightBg: 'bg-slate-50', border: 'border-slate-200' },
  { id: 'uifce', name: 'Institucional', bg: 'bg-purple-600', text: 'text-purple-700', lightBg: 'bg-purple-50', border: 'border-purple-200' },
];

export const UNITS = [
  'UIFCE',
  'Posgrados',
  'Educación Continua',
  'Decanatura',
  'Bienestar',
  'Investigaciones'
];



export const ICONS = [
  { name: 'analytics', label: 'Analítica' },
  { name: 'code', label: 'Código' },
  { name: 'storage', label: 'Base de datos' },
  { name: 'bar_chart', label: 'Gráficos' },
  { name: 'pie_chart', label: 'Estadística' },
  { name: 'functions', label: 'Matemáticas' },
  { name: 'psychology', label: 'Machine Learning' },
  { name: 'group_work', label: 'Trabajo en equipo' },
  { name: 'campaign', label: 'Marketing' },
  { name: 'attach_money', label: 'Finanzas' },
  { name: 'stars', label: 'Estrellas' },
  { name: 'school', label: 'Educación' },
  { name: 'computer', label: 'Computación' },
  { name: 'public', label: 'Global' },
  { name: 'workspace_premium', label: 'Premium' },
];
