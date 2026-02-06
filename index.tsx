
import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, Routes } from '@angular/router';
import { AppComponent } from './src/app.component';
import { ValidationPortalComponent } from './src/pages/validation-portal.component';
import { AdminCatalogComponent } from './src/pages/admin-catalog.component';
import { AdminIssueComponent } from './src/pages/admin-issue.component';
import { StudentDashboardComponent } from './src/pages/student-dashboard.component';

const routes: Routes = [
  { path: '', component: ValidationPortalComponent },
  { path: 'admin/catalog', component: AdminCatalogComponent },
  { path: 'admin/issue', component: AdminIssueComponent },
  { path: 'student', component: StudentDashboardComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation())
  ]
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
