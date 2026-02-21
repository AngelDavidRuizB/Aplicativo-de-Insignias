# Aplicativo de Insignias

Portal web para gestión de insignias FCE.

## 🚀 Despliegue en GitHub Pages

Este aplicativo está configurado para desplegarse automáticamente en GitHub Pages.

### Configuración Automática

El despliegue se realiza automáticamente mediante GitHub Actions cuando se realizan cambios en la rama `main`:

1. **Flujo de trabajo**: `.github/workflows/deploy.yml`
2. **URL de despliegue**: https://angeldavidruizb.github.io/Aplicativo-de-Insignias/

### Activar GitHub Pages

Para que el despliegue funcione, es necesario configurar GitHub Pages en el repositorio:

1. Ve a **Settings** → **Pages** en tu repositorio de GitHub
2. En **Source**, selecciona **GitHub Actions**
3. Guarda los cambios

Una vez configurado, cada push a la rama `main` desplegará automáticamente la aplicación.

### Despliegue Manual

También puedes disparar el despliegue manualmente:

1. Ve a la pestaña **Actions** en GitHub
2. Selecciona el workflow **Deploy to GitHub Pages**
3. Haz clic en **Run workflow**

## 🛠️ Desarrollo Local

### Requisitos

- Node.js 20 o superior
- npm

### Instalación

```bash
npm install --legacy-peer-deps
```

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build

```bash
npm run build
```

Para GitHub Pages (con base-href):

```bash
npm run build -- --base-href=/Aplicativo-de-Insignias/
```

## 📦 Tecnologías

- Angular 21
- TypeScript 5.8
- Tailwind CSS 3
- jsPDF (generación de PDFs)
- html2canvas
