import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, Routes } from '@angular/router';
import { AppComponent } from './src/app/app.component';
import { ValidationPortalComponent } from './src/app/pages/validation-portal.component';
import { AdminCatalogComponent } from './src/app/pages/admin-catalog.component';
import { AdminIssueComponent } from './src/app/pages/admin-issue.component';
import { StudentDashboardComponent } from './src/app/pages/student-dashboard.component';

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
