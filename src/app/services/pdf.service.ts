import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IssuedBadge, Badge } from '../models/badge.model';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  
  generateCertificate(issued: IssuedBadge, badge: Badge): jsPDF {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Fondo decorativo
    doc.setFillColor(106, 27, 154); // Purple
    doc.rect(0, 0, 297, 20, 'F');
    doc.rect(0, 190, 297, 20, 'F');

    // Bordes decorativos
    doc.setDrawColor(106, 27, 154);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    // Logo/Institución
    doc.setFontSize(16);
    doc.setTextColor(106, 27, 154);
    doc.setFont('helvetica', 'bold');
    doc.text('UNIVERSIDAD NACIONAL DE COLOMBIA', 148.5, 40, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Facultad de Ciencias Económicas', 148.5, 48, { align: 'center' });
    doc.text('Unidad de Informática', 148.5, 55, { align: 'center' });

    // Título del certificado
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('CERTIFICADO DE PARTICIPACIÓN', 148.5, 75, { align: 'center' });

    // Texto principal
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Otorgado a:', 148.5, 90, { align: 'center' });

    // Nombre del estudiante
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(issued.studentName.toUpperCase(), 148.5, 105, { align: 'center' });

    // Descripción
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Por haber completado satisfactoriamente el curso:`, 148.5, 120, { align: 'center' });

    // Nombre del curso/insignia
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(106, 27, 154);
    doc.text(badge.name, 148.5, 132, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Duración: ${badge.hours} horas`, 148.5, 140, { align: 'center' });
    doc.text(`Calificación: ${issued.grade.toFixed(1)} / 5.0`, 148.5, 147, { align: 'center' });

    // Fecha
    const fecha = new Date(issued.issueDate).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Bogotá, ${fecha}`, 148.5, 168, { align: 'center' });

    // Código de verificación
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Código de verificación: ${issued.hash}`, 148.5, 180, { align: 'center' });
    doc.text('Verifique la autenticidad en: fce-badges.unal.edu.co', 148.5, 185, { align: 'center' });

    return doc;
  }

  generateBadgeReport(badges: Badge[]): jsPDF {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(106, 27, 154);
    doc.text('Catálogo de Insignias - UIFCE', 14, 20);

    // Fecha
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-CO')}`, 14, 28);

    // Tabla de insignias
    const tableData = badges.map(b => [
      b.name,
      b.unit,
      `${b.hours}h`,
      b.status
    ]);

    autoTable(doc, {
      head: [['Nombre', 'Unidad', 'Horas', 'Estado']],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 10,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [106, 27, 154],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // Totales
    const finalY = (doc as any).lastAutoTable.finalY || 35;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total de insignias: ${badges.length}`, 14, finalY + 15);

    return doc;
  }

  downloadCertificate(issued: IssuedBadge, badge: Badge): void {
    const doc = this.generateCertificate(issued, badge);
    doc.save(`certificado-${issued.studentDocument}-${badge.name.replace(/\s+/g, '_')}.pdf`);
  }

  downloadReport(badges: Badge[]): void {
    const doc = this.generateBadgeReport(badges);
    doc.save(`catalogo-insignias-${new Date().toISOString().split('T')[0]}.pdf`);
  }
}
